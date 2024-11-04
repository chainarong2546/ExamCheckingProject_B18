import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import AppBar from "@/components/AppBar";

type Props = {
    children: React.ReactNode;
};

export default async function Logout_Layout({ children }: Props) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="h-screen flex flex-col">
            <header className="z-10">
                <AppBar />
            </header>
            {children}
        </div>
    );
}
