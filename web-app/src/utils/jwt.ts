import hkdf from "@panva/hkdf";
import { calculateJwkThumbprint, base64url, EncryptJWT, jwtDecrypt } from "jose";
import { SECRET_KEY } from "../config";
import { TokenPayload } from "../types/jwt";

type Digest = Parameters<typeof calculateJwkThumbprint>[1];

const salt = "dwadiudididdhidha"
const alg = "dir";
const enc = "A256CBC-HS512";

let secret: Uint8Array;
let thumbprint: string;

const initializeEncryptionSecret = async () => {
    if (!secret) {
        secret = await hkdf(
            "sha512",
            SECRET_KEY,
            salt,
            `User_Service at ExamCheckingProject Generated Encryption Key (${salt})`,
            64,
        );
        thumbprint = await calculateJwkThumbprint(
            { kty: "oct", k: base64url.encode(secret) },
            `sha${secret.byteLength << 3}` as Digest,
        );
    }
};

export const jwtEncode = async (token: TokenPayload, maxAge: number | string | Date) => {
    await initializeEncryptionSecret();
    return await new EncryptJWT(token)
        .setProtectedHeader({ alg, enc, kid: thumbprint })
        .setIssuedAt()
        .setExpirationTime(maxAge)
        .setJti(crypto.randomUUID())
        .encrypt(secret);
};

export const jwtDecode = async (token: string) => {
    if (!token) return null;
    await initializeEncryptionSecret();
    try {
        const { payload } = await jwtDecrypt(
            token,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            async ({ kid, enc }) => {
                if (kid === undefined || kid === thumbprint) return secret;
                throw new Error("no matching decryption secret");
            },
            {
                clockTolerance: 15,
                keyManagementAlgorithms: [alg],
                contentEncryptionAlgorithms: [enc],
            },
        );
        return payload as TokenPayload;
    } catch (error) {
        console.error(error);
        
        return null;
    }
};
