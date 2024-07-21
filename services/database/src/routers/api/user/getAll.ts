import { Request, NextFunction, response } from "express";
import { typedResponse } from "../../../types/express";
import { prisma } from "../../../libs/prisma";

export async function getAll(
    req: Request,
    res: typedResponse<any>,
    next: NextFunction,
) {
    const allUsers = await prisma.user.findMany();
    console.log(allUsers);

    res.status(200).json({
        success: true,
        data: {
            allUsers,
        },
    });
}
