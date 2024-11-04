"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

type Props = {
    params: {
        id: string;
    };
};

export default function UserDetail_Page({ params }: Props) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        email: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Password and Confirm Password do not match!",
            });
            return;
        }

        try {
            const response = await fetch(`/api/users/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                }),
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "สำเร็จ",
                    text: "สร้างผู้ใช้สำเร็จแล้ว!",
                });
                router.push("/dashboard/users");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "ข้อผิดพลาด",
                    text: result.message || "สร้างผู้ใช้ไม่สำเร็จ!",
                });
            }
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "ข้อผิดพลาด",
                text: "เกิดข้อผิดพลาด โปรดลองอีกครั้งในภายหลัง",
            });
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const fetchRes = await fetch(`/api/users/${params.id}`, {
                    method: "GET",
                });
                const data = await fetchRes.json();
                if (data.success && data.data) {
                    setFormData({
                        username: data.data.username,
                        password: "",
                        confirmPassword: "",
                        first_name: data.data.first_name,
                        last_name: data.data.last_name,
                        email: data.data.email,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, [params.id]);

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-bold mb-4">แก้ไขข้อมูลผู้ใช้</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-black dark:text-white">ชื่อผู้ใช้</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        className="w-full px-3 py-2 border rounded-md text-black"
                        disabled
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black dark:text-white">รหัสผ่านใหม่</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md text-black"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black dark:text-white">ยืนยันรหัสผ่าน</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md text-black"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black dark:text-white">ชื่อจริง</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md text-black"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black dark:text-white">นามสกุล</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md text-black"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black dark:text-white">อีเมล</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md text-black"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:brightness-90"
                >
                    บันทึก
                </button>
            </form>
        </div>
    );
}
