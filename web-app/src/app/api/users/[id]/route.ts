import { NextResponse } from "next/server";
import { prismaClient } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { idParamParse } from "@/utils/idParamParse";
import { hashPassword } from "@/utils/bcrypt";

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
                message: "ไอดีผู้ใช้ไม่ใช่จำนวนเต็ม",
            },
            { status: 400 },
        );
    }

    try {
        const user = await prismaClient.users.findUnique({
            where: {
                id: idNum,
                deleted: false,
            },
        });
        return NextResponse.json({
            success: true,
            message: "ดึงข้อมูลผู้ใช้สำเร็จ",
            data: user,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
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
                message: "ไอดีผู้ใช้ไม่ใช่จำนวนเต็ม",
            },
            { status: 400 },
        );
    }

    try {
        const data = await request.json();

        const hashPass = await hashPassword(data.password);
        const updatedAnswer = await prismaClient.users.update({
            where: {
                id: idNum,
                deleted: false,
            },
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: hashPass,
            },
        });
        return NextResponse.json({
            success: true,
            message: "อัปเดตผู้ใช้สำเร็จแล้ว",
            data: updatedAnswer,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการอัปเดตผู้ใช้",
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
                message: "ไอดีผู้ใช้ไม่ใช่จำนวนเต็ม",
            },
            { status: 400 },
        );
    }

    try {
        const deletedUser = await prismaClient.users.update({
            where: {
                id: idNum,
            },
            data: {
                deleted: true,
            },
        });
        return NextResponse.json({
            success: true,
            message: "ลบผู้ใช้สำเร็จแล้ว",
            data: deletedUser,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการลบผู้ใช้",
            },
            { status: 500 },
        );
    }
}
