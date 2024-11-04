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
                message: "ไอดีกระดาษคำตอบไม่ใช่จำนวนเต็ม",
            },
            { status: 400 },
        );
    }

    try {
        const sheet = await prismaClient.sheets.findUnique({
            where: {
                deleted: false,
                id: idNum,
            },
        });
        return NextResponse.json({
            success: true,
            message: "ดึงข้อมูลกระดาษคำตอบสำเร็จ",
            data: sheet,
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

// PUT - Update
export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
                message: "ไอดีกระดาษคำตอบไม่ใช่จำนวนเต็ม",
            },
            { status: 400 },
        );
    }

    try {
        const data = await request.json();
        const updatedSheet = await prismaClient.sheets.update({
            where: {
                id: idNum,
            },
            data: {
                process_id: data.process_id,
                template_id: data.template_id,
                answer_id: data.answer_id,
                status: data.status,
            },
        });
        return NextResponse.json({
            success: true,
            message: "อัปเดตกระดาษคำตอบเรียบร้อยแล้ว",
            data: updatedSheet,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการอัปเดตกระดาษคำตอบ",
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
                message: "ไอดีกระดาษคำตอบไม่ใช่จำนวนเต็ม",
            },
            { status: 400 },
        );
    }

    try {
        const deletedSheet = await prismaClient.sheets.update({
            where: {
                id: idNum,
            },
            data: {
                deleted: true,
            },
        });
        return NextResponse.json({
            success: true,
            message: "ลบข้อมูลกระดาษคำตอบเรียบร้อยแล้ว",
            data: deletedSheet,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการลบข้อมูลกระดาษคำตอบ",
            },
            { status: 500 },
        );
    }
}
