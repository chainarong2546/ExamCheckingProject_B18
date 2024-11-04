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
        const groups = await prismaClient.groups.findMany({
            where: {
                owner_id: session.user.id,
                un_use: false,
            },
            select: {
                id: true,
                name: true,
                subject: true,
                year: true,
                term: true,
                answers: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                templates: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        sheets: {
                            where: {
                                deleted: false,
                            },
                        },
                    },
                },
            },
        });
        return NextResponse.json({
            success: true,
            message: "ดึงข้อมูลกลุ่มการตรวจสำเร็จ",
            data: groups,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการดึงข้อมูลกลุ่มการตรวจ",
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
        const newGroup = await prismaClient.groups.create({
            data: {
                name: data.name,
                subject: data.subject,
                year: data.year,
                term: data.term,
                template_id: data.template_id,
                answer_id: data.answer_id,
                owner_id: session.user.id,
            },
        });
        return NextResponse.json(
            {
                success: true,
                message: "สร้างกลุ่มการตรวจสำเร็จ",
                data: newGroup,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการสร้างกลุ่มการตรวจ",
            },
            { status: 500 },
        );
    }
}
