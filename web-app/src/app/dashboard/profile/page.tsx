"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Profile_Page() {
    const [profileData, setProfileData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
    });

    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // ส่งข้อมูลอัปเดตโปรไฟล์ไปที่ API
        try {
            const response = await fetch("/api/profile/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profileData),
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire("สำเร็จ", "อัปเดตโปรไฟล์สำเร็จแล้ว", "success");
            } else {
                Swal.fire("เกิดข้อผิดพลาด", result.message || "การอัปเดตโปรไฟล์ล้มเหลว", "error");
            }
        } catch (error) {
            console.error(error);

            Swal.fire("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดขณะอัปเดตโปรไฟล์", "error");
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ตรวจสอบว่า newPassword และ confirmPassword ตรงกันหรือไม่
        if (passwordData.new_password !== passwordData.confirm_password) {
            Swal.fire("เกิดข้อผิดพลาด", "รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน!", "error");
            return;
        }

        // ส่งข้อมูลเปลี่ยนรหัสผ่านไปที่ API
        try {
            const response = await fetch("/api/profile/change-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(passwordData),
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire("สำเร็จ", "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว", "success");
            } else {
                Swal.fire("เกิดข้อผิดพลาด", result.message || "การเปลี่ยนรหัสผ่านล้มเหลว", "error");
            }
        } catch (error) {
            console.error(error);

            Swal.fire("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดขณะเปลี่ยนรหัสผ่าน", "error");
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fetchRes = await fetch("/api/profile", {
                    method: "GET",
                });
                const data = await fetchRes.json();
                if (data.success && data.data) {
                    setProfileData({
                        username: data.data.username,
                        first_name: data.data.first_name,
                        last_name: data.data.last_name,
                        email: data.data.email,
                    });
                } else {
                    throw new Error("การดึงข้อมูลโปรไฟล์ล้มเหลว");
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Section for Profile Picture */}
                <div className="w-full md:w-1/4">
                    <div className="bg-gray-200 w-full aspect-square rounded-lg flex items-center justify-center p-5">
                        {/* Profile Picture */}
                        <Image src={"/profile.jpg"} alt="Profile image" width={500} height={500} />
                    </div>
                </div>

                {/* Section for Profile Details */}
                <div className="flex-grow w-full md:w-2/3">
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <h2 className="text-xl font-bold">รายละเอียด</h2>

                        <div>
                            <label className="block text-gray-700">ชื่อผู้ใช้</label>
                            <input
                                type="text"
                                name="username"
                                value={profileData.username}
                                onChange={handleProfileChange}
                                className="w-full px-3 py-2 border rounded-md"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">ชื่อจริง</label>
                            <input
                                type="text"
                                name="first_name"
                                value={profileData.first_name}
                                onChange={handleProfileChange}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">นามสกุล</label>
                            <input
                                type="text"
                                name="last_name"
                                value={profileData.last_name}
                                onChange={handleProfileChange}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">อีเมล</label>
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleProfileChange}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            อัพเดทโปรไฟล์
                        </button>
                    </form>

                    {/* Form for Password Change */}
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-6">
                        <h2 className="text-xl font-bold">เปลี่ยนรหัสผ่าน</h2>

                        <div>
                            <label className="block text-gray-700">รหัสผ่านเก่า</label>
                            <input
                                type="password"
                                name="old_password"
                                value={passwordData.old_password}
                                onChange={handlePasswordChange}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">รหัสผ่านใหม่</label>
                            <input
                                type="password"
                                name="new_password"
                                value={passwordData.new_password}
                                onChange={handlePasswordChange}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">ยืนยันรหัสผ่านใหม่</label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={passwordData.confirm_password}
                                onChange={handlePasswordChange}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                            เปลี่ยนรหัสผ่าน
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
