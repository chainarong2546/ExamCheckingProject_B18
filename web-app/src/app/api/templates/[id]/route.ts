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
                message: "ไอดีแม่แบบกระดาษคำตอบไม่ใช่จำนวนเต็ม",
            },
            { status: 400 },
        );
    }

    try {
        const template = await prismaClient.templates.findUnique({
            where: {
                id: idNum,
                un_use: false,
            },
        });
        return NextResponse.json({
            success: true,
            message: "ดึงข้อมูลแม่แบบกระดาษคำตอบสำเร็จ",
            data: template,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการดึงข้อมูลแม่แบบกระดาษคำตอบ",
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
                message: "ไอดีแม่แบบกระดาษคำตอบไม่ใช่จำนวนเต็ม",
            },
            { status: 400 },
        );
    }

    try {
        const deletedTemplate = await prismaClient.templates.update({
            where: {
                id: idNum,
            },
            data: {
                un_use: true,
            },
        });
        return NextResponse.json({
            success: true,
            message: "ลบแม่แบบกระดาษคำตอบเรียบร้อยแล้ว",
            data: deletedTemplate,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการลบแม่แบบกระดาษคำตอบ",
            },
            { status: 500 },
        );
    }
}
