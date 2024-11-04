import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import Link from "next/link";

type Props = {
    children: React.ReactNode;
    params: {
        id: string;
    };
};

export default async function GroupDetail_Layout({ children, params }: Props) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <h2 className="text-xl"> รายละเอียดกลุ่มการตรวจ ID :  {params.id}</h2>
                <Link href={`/dashboard/predict/${params.id}`} className="text-white bg-purple-600 py-2 px-3 rounded-md">รายละเอียดการตรวจข้อสอบ</Link>
            </div>
            <hr className="my-2 border-t border-gray-400" />
            {children}
        </div>
    );
}
