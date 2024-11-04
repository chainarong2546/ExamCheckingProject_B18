"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { prismaClient } from "@/utils/prisma";

export default async function selectTemplateShowDetail(id: number) {
    const session = await getServerSession(authOptions);

    if (session?.user === undefined) {
        return {
            success: false,
            error: "Can not find session user",
        };
    }

    try {
        const selectData = await prismaClient.templates.findUnique({
            where: {
                id: id,
                un_use: false,
            },
        });
        return {
            success: true,
            data: selectData,
        };
    } catch (error) {
        console.error(error);
        
        return {
            success: false,
            error: "Prisma Error",
        };
    }
}
