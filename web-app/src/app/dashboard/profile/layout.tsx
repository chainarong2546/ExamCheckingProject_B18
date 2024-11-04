import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

type Props = {
    children: React.ReactNode;
};

export default async function Profile_Layout({ children }: Props) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <h2 className="text-xl"> โปรไฟล์ของฉัน </h2>
            </div>
            <hr className="my-2 border-t border-gray-400" />
            {children}
        </div>
    );
}
