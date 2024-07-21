import "jose";

declare module "jose" {
    export interface JWTPayload {
        userID: string;
        role: number;
    }
}
