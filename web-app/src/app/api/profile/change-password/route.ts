import { NextResponse } from "next/server";
import { prismaClient } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { comparePassword, hashPassword } from "@/utils/bcrypt";

// PUT - Update
export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user === undefined) {
        return NextResponse.json(
            {
                success: false,
                message: "ไม่พบเซสชันผู้ใช้",
            },
            { status: 401 },
        );
    }

    try {
        const data = await request.json();
        if (data.new_password !== data.confirm_password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "รหัสผ่านไม่ตรงกัน",
                },
                { status: 400 },
            );
        }

        const user = await prismaClient.users.findUnique({
            where: {
                id: session.user.id,
                deleted: false,
            },
            select: {
                password: true,
            },
        });

        const check = await comparePassword(data.old_password, user?.password || "");
        if (!check) {
            return NextResponse.json(
                {
                    success: false,
                    message: "รหัสผ่านไม่ถูกต้อง",
                },
                { status: 400 },
            );
        }

        const hashPass = await hashPassword(data.new_password);
        const updateUser = await prismaClient.users.update({
            where: {
                id: session.user.id,
                deleted: false,
            },
            data: {
                password: hashPass,
            },
        });
        return NextResponse.json(
            {
                success: true,
                message: "อัปเดตรหัสผ่านสำเร็จ",
                data: {
                    id: updateUser.id,
                },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการอัปเดตรหัสผ่าน",
            },
            { status: 500 },
        );
    }
}
