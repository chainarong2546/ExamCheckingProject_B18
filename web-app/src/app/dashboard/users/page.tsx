"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

type User = {
    id: number;
    username: string;
    email: string;
};

export default function UserPage() {
    const [users, setUsers] = useState<User[]>([]);

    // ฟังก์ชันดึงข้อมูลผู้ใช้ทั้งหมดจาก API
    useEffect(() => {
        const fetchUserData = async () => {
            const fetchRes = await fetch("/api/users", {
                method: "GET",
            });
            const data = await fetchRes.json();
            if (data.success && data.data) {
                setUsers(data.data);
            }
        };
        fetchUserData();
    }, []);

    const handleDelete = (id: number) => {
        // แสดง SweetAlert2 เพื่อยืนยันการลบ
        Swal.fire({
            title: "คุณแน่ใจเหรอ?",
            text: "คุณจะไม่สามารถย้อนกลับสิ่งนี้ได้!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่",
            cancelButtonText: "ยกเลิก"
        }).then((result) => {
            if (result.isConfirmed) {
                // ถ้ายืนยัน ให้ทำการลบผู้ใช้
                fetch(`/api/users/${id}`, {
                    method: "DELETE",
                })
                    .then(() => {
                        // ลบผู้ใช้ใน state หลังจากลบใน API เสร็จ
                        setUsers(users.filter((user) => user.id !== id));
                        // แสดงข้อความสำเร็จ
                        Swal.fire("ลบแล้ว!", "ผู้ใช้ถูกลบแล้ว", "success");
                    })
                    .catch((error) => {
                        console.error("Error deleting user:", error);
                        Swal.fire("ข้อผิดพลาด!", "เกิดปัญหาในการลบผู้ใช้", "error");
                    });
            }
        });
    };

    return (
        <table className="min-w-full">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b text-left">ชื่อผู้ใช้</th>
                    <th className="py-2 px-4 border-b text-left">อีเมล</th>
                    <th className="py-2 px-4 border-b text-left">ดำเนินการ</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td className="py-2 px-4 border-b">{user.username}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">
                            <button
                                className="bg-red-500 text-white px-4 py-1 rounded-md mr-2 hover:bg-red-600"
                                onClick={() => handleDelete(user.id)}
                            >
                                ลบ
                            </button>
                            <Link
                                className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600"
                                href={`/dashboard/user/${user.id}`}
                            >
                                แก้ไข
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
