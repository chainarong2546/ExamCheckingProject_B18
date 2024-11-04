import { NextResponse } from "next/server";
import { prismaClient } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

// GET - Select All
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
        const answers = await prismaClient.answers.findMany({
            where: {
                owner_id: session.user.id,
                archive: false,
            },
            select: {
                id: true,
                name: true,
                subject: true,
                year: true,
                term: true,
                total_no: true,
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
        const newAnswer = await prismaClient.answers.create({
            data: {
                name: data.name,
                owner_id: session.user.id,
                subject: data.subject,
                year: data.year,
                term: data.term,
                total_no: data.total_no,
                answer: data.answer,
            },
        });
        return NextResponse.json(
            {
                success: true,
                message: "สร้างเฉลยสำเร็จ",
                data: newAnswer,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการสร้างเฉลย",
            },
            { status: 500 },
        );
    }
}
