import hkdf from "@panva/hkdf";
import {
    calculateJwkThumbprint,
    base64url,
    EncryptJWT,
    jwtDecrypt,
    JWTPayload,
} from "jose";
import {
    TOKEN_SECRET_KEY,
    REFRESH_TOKEN_SECRET_KEY,
    JWT_SALT,
    TOKEN_MAX_AGE,
    REFRESH_TOKEN_MAX_AGE,
} from "../config/token";

type Digest = Parameters<typeof calculateJwkThumbprint>[1];

const alg = "dir";
const enc = "A256CBC-HS512";
const salt = JWT_SALT;

let secret_token: Uint8Array;
let secret_refresh: Uint8Array;
let thumbprint_token: string;
let thumbprint_refresh: string;

async function initializeEncryptionSecret() {
    if (!secret_token) {
        secret_token = await hkdf(
            "sha512",
            TOKEN_SECRET_KEY,
            salt,
            `User_Service at ExamCheckingProject Generated Encryption Key (${salt})`,
            64,
        );
        thumbprint_token = await calculateJwkThumbprint(
            { kty: "oct", k: base64url.encode(secret_token) },
            `sha${secret_token.byteLength << 3}` as Digest,
        );
    }
    if (!secret_refresh) {
        secret_refresh = await hkdf(
            "sha512",
            REFRESH_TOKEN_SECRET_KEY,
            salt,
            `User_Service at ExamCheckingProject Generated Encryption Key (${salt})`,
            64,
        );
        thumbprint_refresh = await calculateJwkThumbprint(
            { kty: "oct", k: base64url.encode(secret_refresh) },
            `sha${secret_refresh.byteLength << 3}` as Digest,
        );
    }
}

async function jwtEncode(token: JWTPayload, type: "token" | "refresh") {
    await initializeEncryptionSecret();
    const maxAge = type == "token" ? TOKEN_MAX_AGE : REFRESH_TOKEN_MAX_AGE;
    const thumbprint = type == "token" ? thumbprint_token : thumbprint_refresh;
    const secret = type == "token" ? secret_token : secret_refresh;
    return await new EncryptJWT(token)
        .setProtectedHeader({ alg, enc, kid: thumbprint })
        .setIssuedAt()
        .setExpirationTime(Date.now() / 1000 + maxAge / 1000)
        .setJti(crypto.randomUUID())
        .encrypt(secret);
}

async function jwtDecode(token: string, type: "token" | "refresh") {
    if (!token) return null;
    await initializeEncryptionSecret();
    const thumbprint = type == "token" ? thumbprint_token : thumbprint_refresh;
    const secret = type == "token" ? secret_token : secret_refresh;
    try {
        const { payload } = await jwtDecrypt(
            token,
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
        return payload;
    } catch (error) {
        return null;
    }
}

export { jwtEncode, jwtDecode };
