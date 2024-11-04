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
        const group = await prismaClient.groups.findUnique({
            where: {
                id: idNum,
                un_use: false,
                owner_id: session.user.id,
            },
            select: {
                id: true,
                name: true,
                subject: true,
                year: true,
                term: true,
                created_at: true,
                updated_at: true,
                sheets: {
                    where: {
                        deleted: false,
                    },
                    select: {
                        id: true,
                        name: true,
                        status: true,
                    },
                },
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
                        sheets: true,
                    },
                },
            },
        });
        return NextResponse.json({
            success: true,
            message: "ดึงข้อมูลกลุ่มการตรวจสำเร็จ",
            data: group,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: "เกิดข้อผิดพลาดในการดึงข้อมูลกลุ่มการตรวจ",
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
                message: "ไอดีกลุ่มการตรวจไม่ใช่จำนวนเต็ม",
            },
            { status: 400 },
        );
    }

    try {
        const data = await request.json();
        const newGroup = await prismaClient.groups.update({
            where: {
                id: idNum,
                un_use: false,
                owner_id: session.user.id,
            },
            data: {
                name: data.name,
                subject: data.subject,
                year: data.year,
                term: data.term,
            },
        });
        return NextResponse.json(
            {
                success: true,
                message: "อัปเดตกลุ่มการตรวจเรียบร้อยแล้ว",
                data: newGroup,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการอัปเดตกลุ่มการตรวจ",
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
        const deletedGroup = await prismaClient.groups.update({
            where: {
                id: idNum,
                owner_id: session.user.id,
            },
            data: {
                un_use: true,
            },
        });
        return NextResponse.json({
            success: true,
            message: "ลบกลุ่มการตรวจเรียบร้อยแล้ว",
            data: deletedGroup,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการลบกลุ่มการตรวจ",
            },
            { status: 500 },
        );
    }
}
