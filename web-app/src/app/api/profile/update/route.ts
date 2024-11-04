import { NextResponse } from "next/server";
import { prismaClient } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

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

        const updateUser = await prismaClient.users.update({
            where: {
                id: session.user.id,
                deleted: false,
            },
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
            },
        });
        return NextResponse.json(
            {
                success: true,
                message: "อัปเดตโปรไฟล์เรียบร้อยแล้ว",
                data: updateUser,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์",
            },
            { status: 500 },
        );
    }
}
