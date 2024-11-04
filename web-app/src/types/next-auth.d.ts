// types/next-auth.d.ts หรือ src/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

// ขยาย interface ของ Session เพื่อเพิ่มข้อมูลเพิ่มเติม
declare module "next-auth" {
    interface Session {
        user?: {
            id: number;
            role_id: number;
            username: string;
        };
    }

    interface User {
        id: number;
        role_id: number;
        username: string;
    }
}

// ขยาย interface ของ JWT Token เพื่อเพิ่มข้อมูลเพิ่มเติม
declare module "next-auth/jwt" {
    interface JWT {
        id: number;
        role_id: number;
        username: string;
    }
}
