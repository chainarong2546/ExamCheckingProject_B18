import { NextResponse } from "next/server";
import { prismaClient } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

// POST - Insert
export async function POST(request: Request) {
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
        const newSheet = await prismaClient.sheets.create({
            data: {
                name: data.name,
                group_id: data.group_id,
            },
        });
        return NextResponse.json(
            {
                success: true,
                message: "เพิ่มกระดาษคำตอบสำเร็จ",
                data: newSheet,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการเพิ่มกระดาษคำตอบ",
            },
            { status: 500 },
        );
    }
}
