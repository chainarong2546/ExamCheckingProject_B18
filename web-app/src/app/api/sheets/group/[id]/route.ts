import { NextResponse } from "next/server";
import { prismaClient } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { idParamParse } from "@/utils/idParamParse";

// GET - Select
export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    const idNum = idParamParse(params.id);
    if (!idNum) {
        return NextResponse.json(
            {
                success: false,
                message: "ไอดีกลุ่มการตรวจไม่ใช่จำนวนเต็ม",
            },
            { status: 400 },
        );
    }

    try {
        const sheets = await prismaClient.sheets.findMany({
            where: {
                deleted: false,
                group_id: idNum,
            },
            select: {
                id: true,
                name: true,
                status: true,
            },
        });
        return NextResponse.json({
            success: true,
            message: "ดึงข้อมูลกระดาษคำตอบสำเร็จ",
            data: sheets,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: "เกิดข้อผิดพลาดในการดึงข้อมูลกระดาษคำตอบ",
            },
            { status: 500 },
        );
    }
}

// DELETE - Delete
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    const idNum = idParamParse(params.id);
    if (!idNum) {
        return NextResponse.json(
            {
                success: false,
                message: "ไอดีกลุ่มการตรวจไม่ใช่จำนวนเต็ม",
            },
            { status: 400 },
        );
    }

    try {
        const deletedSheets = await prismaClient.sheets.updateMany({
            where: {
                group_id: idNum,
            },
            data: {
                deleted: true,
            },
        });
        return NextResponse.json({
            success: true,
            message: "ลบกระดาษคำตอบในกลุ่มการตรวจเรียบร้อยแล้ว",
            data: deletedSheets,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการลบกระดาษคำตอบ",
            },
            { status: 500 },
        );
    }
}
