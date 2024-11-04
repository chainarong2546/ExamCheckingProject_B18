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
        const templates = await prismaClient.templates.findMany({
            where: {
                un_use: false,
            },
            select: {
                id: true,
                name: true,
                marker_qr_data: true,
                total_no: true,
                image_url: true,
            },
        });
        return NextResponse.json({
            success: true,
            message: "ดึงข้อมูลแม่แบบกระดาษคำตอบสำเร็จ",
            data: templates,
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
        const newTemplate = await prismaClient.templates.create({
            data: {
                name: data.name,
                total_no: data.total_no,
                image_url: data.image_url,
                pdf_url: data.pdf_url,
                marker_qr: data.marker_qr,
                marker_qr_data: data.marker_qr_data,
                marker_tl: data.marker_tl,
                marker_tl_center: data.marker_tl_center,
                marker_tr: data.marker_tr,
                marker_tr_center: data.marker_tr_center,
                marker_bl: data.marker_bl,
                marker_bl_center: data.marker_bl_center,
                marker_br: data.marker_br,
                marker_br_center: data.marker_br_center,
                square_std_id: data.square_std_id,
                square_answer: data.square_answer,
            },
        });
        return NextResponse.json(
            {
                success: true,
                message: "สร้างแม่แบบกระดาษคำตอบสำเร็จ",
                data: newTemplate,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการสร้างแม่แบบกระดาษคำตอบ",
            },
            { status: 500 },
        );
    }
}
