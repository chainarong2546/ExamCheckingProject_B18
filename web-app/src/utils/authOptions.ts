import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { comparePassword } from "@/utils/bcrypt";
import { prismaClient } from "@/utils/prisma";


export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Username" },
                password: { label: "Password", type: "password", placeholder: "Password" },
            },

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            async authorize(credentials, req) {
                if (!credentials) {
                    throw new Error("Username or Password is undefined.");
                }
                if (credentials.username.trim() === "" || credentials.password.trim() === "") {
                    throw new Error("Username or Password is blank.");
                }

                let data;
                try {
                    data = await prismaClient.users.findUnique({
                        where: {
                            username: credentials.username,
                            deleted: false,
                        },
                        select: {
                            id: true,
                            role_id: true,
                            username: true,
                            password: true,
                        },
                    });
                } catch (err) {
                    console.error(err);
                    throw new Error("Prisma Error.");
                }

                if (data) {
                    if (await comparePassword(credentials.password, data.password)) {
                        return {
                            id: data.id,
                            role_id: data.role_id,
                            username: data.username,
                        };
                    }
                }

                throw new Error("Invalid username or password");
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = Number(user.id);
                token.role_id = user.role_id;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id,
                    role_id: token.role_id,
                    username: token.username,
                };
            }
            return session;
        },
    },
    pages: {
        signIn: "/login", // ระบุหน้าที่ใช้สำหรับ login
        error: "/login", // กำหนดให้แสดง error ที่หน้า login เดิม
    },
};
