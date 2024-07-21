import { Request, NextFunction, response } from "express";
import { typedResponse } from "../../../types/express";
import { prisma } from "../../../libs/prisma";

export async function getByID(
    req: Request,
    res: typedResponse<any>,
    next: NextFunction,
) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Invalid id",
            });
        }

        prisma.user.findUnique({
            where: {
                ID: id,
            },
        });

        res.json({
            success: true,
            data: {
                uuid: "",
                username: "",
                password: "",
                email: "",
                role: 0,
            },
        });
    } catch (error) {
        next(error);
    }
}
