import { NextResponse } from "next/server";
import { prismaClient } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

// GET - Select
export async function GET() {
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
        const users = await prismaClient.users.findUnique({
            where: {
                id: session.user.id,
                deleted: false,
            },
            select: {
                id: true,
                username: true,
                first_name: true,
                last_name: true,
                email: true,
            },
        });
        return NextResponse.json({
            success: true,
            message: "ดึงข้อมูลโปรไฟล์สำเร็จ",
            data: users,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์",
            },
            { status: 500 },
        );
    }
}
