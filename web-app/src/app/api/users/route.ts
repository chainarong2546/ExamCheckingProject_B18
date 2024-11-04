import { NextResponse } from "next/server";
import { prismaClient } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { hashPassword } from "@/utils/bcrypt";

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
        const users = await prismaClient.users.findMany({
            where: {
                deleted: false,
            },
            select: {
                id: true,
                username: true,
                email: true,
            },
        });
        return NextResponse.json({
            success: true,
            message: "ดึงข้อมูลผู้ใช้สำเร็จ",
            data: users,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
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
        const hashPass = await hashPassword(data.password);
        const newUser = await prismaClient.users.create({
            data: {
                username: data.username,
                password: hashPass,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                role_id: 2,
            },
        });
        return NextResponse.json(
            {
                success: true,
                message: "เพิ่มผู้ใช้สำเร็จ",
                data: newUser,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการเพิ่มผู้ใช้",
            },
            { status: 500 },
        );
    }
}
