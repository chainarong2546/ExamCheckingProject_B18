import { JWTPayload } from "jose";

export interface TokenPayload extends JWTPayload {
    type: "server" | "client";
    user: {
        id: number;
        role_id: number;
    };
}
