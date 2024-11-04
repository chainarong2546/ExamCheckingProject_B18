"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { prismaClient } from "@/utils/prisma";

export default async function selectSheetShowGroup(group_id: number) {
    const session = await getServerSession(authOptions);
    if (session?.user === undefined) {
        return {
            success: false,
            message: "Can not find session user",
        };
    }

    let data;
    try {
        data = await prismaClient.sheets.findMany({
            where: {
                deleted: false,
                group_id: group_id,
            },
            select: {
                id: true,
                name: true,
                status: true,
            }
        });
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Prisma Error",
        };
    }

    return {
        success: true,
        message: "Select data success",
        data: data,
    };
}
