"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = object;
export default function Logout_Page({}: Props) {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 mt-48 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-100">ออกจากระบบ</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ? เราหวังว่าจะได้พบคุณอีกครั้งในเร็ว ๆ นี้!
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => {
                            signOut();
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                        ใช่ ออกจากระบบ
                    </button>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                        ยกเลิก
                    </button>
                </div>
            </div>
        </div>
    );
}
