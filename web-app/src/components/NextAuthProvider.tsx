"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

type Props = Readonly<{
    children: React.ReactNode;
    session: Session | null;
}>;

export default function NextAuthProvider({ children, session }: Props) {
    return (
        <SessionProvider
            session={session}
            basePath="/api/auth"
            refetchInterval={5 * 60}
            refetchOnWindowFocus={true}
        >
            {children}
        </SessionProvider>
    );
}
