import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import Link from "next/link";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    children: React.ReactNode;
};

export default async function Answers_Layout({ children }: Props) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <h2 className="text-xl"> แม่แบบกระดาษคำตอบทั้งหมด </h2>
                {session.user.role_id === 1 ? (
                    <Link
                        href={"/dashboard/create-template"}
                        className="flex gap-2 px-3 py-2 justify-center items-center rounded-lg bg-green-700 text-white"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <p>เพิ่มแม่แบบกระดาษคำตอบ</p>
                    </Link>
                ) : null}
            </div>
            <hr className="my-2 border-t border-gray-400" />
            {children}
        </div>
    );
}
