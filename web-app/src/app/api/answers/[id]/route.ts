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
                message: "ไอดีเฉลยไม่ใช่จำนวนเต็ม",
            },
            { status: 400 },
        );
    }

    try {
        const answers = await prismaClient.answers.findUnique({
            where: {
                id: idNum,
                owner_id: session.user.id,
                archive: false,
            },
        });
        return NextResponse.json({
            success: true,
            message: "ดึงข้อมูลเฉลยได้สำเร็จ",
            data: answers,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการดึงข้อมูลเฉลย",
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
                message: "ไอดีเฉลยไม่ใช่จำนวนเต็ม",
            },
            { status: 400 },
        );
    }

    try {
        const data = await request.json();
        const updatedAnswer = await prismaClient.answers.update({
            where: {
                id: idNum,
                archive: false,
                owner_id: session.user.id,
            },
            data: {
                name: data.name,
                subject: data.subject,
                year: data.year,
                term: data.term,
                total_no: data.total_no,
                answer: data.answer,
            },
        });
        return NextResponse.json({
            success: true,
            message: "อัปเดตข้อมูลเฉลยเรียบร้อยแล้ว",
            data: updatedAnswer,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลเฉลย",
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
                message: "ไอดีเฉลยไม่ใช่จำนวนเต็ม",
            },
            { status: 400 },
        );
    }

    try {
        const deletedAnswer = await prismaClient.answers.update({
            where: {
                id: idNum,
                owner_id: session.user.id,
            },
            data: {
                archive: true,
            },
        });
        return NextResponse.json({
            success: true,
            message: "ลบข้อมูลเฉลยเรียบร้อยแล้ว",
            data: deletedAnswer,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการลบข้อมูลเฉลย",
            },
            { status: 500 },
        );
    }
}
