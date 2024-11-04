import { NextRequest, NextResponse } from "next/server";
import { jwtEncode } from "@/utils/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (session?.user === undefined) {
        return NextResponse.json(
            {
                success: false,
                message: "ไม่พบเซสชันผู้ใช้",
            },
            { status: 400 },
        );
    }

    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const image = (body.image as Blob) || null;

    if (!image) {
        return NextResponse.json(
            {
                success: false,
                message: "ไม่พบรูปภาพ",
            },
            { status: 400 },
        );
    }

    const token = await jwtEncode(
        { type: "client", user: { id: session.user.id, role_id: session.user.role_id } },
        "5m",
    );

    try {
        const fetchRes = await fetch(`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_API_URL}/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!fetchRes.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: "เกิดข้อผิดพลาดระหว่างการแปลงรูปภาพ",
                },
                { status: 400 },
            );
        }

        const data = await fetchRes.json();

        if (data.success && data.data) {
            return NextResponse.json(
                {
                    success: true,
                    message: "อัพโหลดไฟล์สำเร็จ",
                    data: {
                        image_name: data.data.filename,
                    },
                },
                { status: 200 },
            );
        }
    } catch (err) {
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดระหว่างการแปลงรูปภาพ",
                error: err,
            },
            { status: 400 },
        );
    }
};
