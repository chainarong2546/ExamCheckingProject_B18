"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function CreateUserPage() {
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
                title: "เกิดข้อผิดพลาด",
                text: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน!",
            });
            return;
        }

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
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
                    title: "เกิดข้อผิดพลาด",
                    text: result.message || "สร้างผู้ใช้ไม่สำเร็จ!",
                });
            }
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "โปรดลองอีกครั้งในภายหลัง",
            });
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-bold mb-4">เพิ่มผู้ใช้</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-black dark:text-white">ชื่อผู้ใช้</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md text-black"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black dark:text-white">รหัสผ่าน</label>
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
                    เพิ่มผู้ใช้
                </button>
            </form>
        </div>
    );
}
