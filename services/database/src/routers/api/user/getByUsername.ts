import { Request, NextFunction, response } from "express";
import { typedResponse } from "../../../types/express";
import { prisma } from "../../../libs/prisma";

export async function getByUsername(
    req: Request,
    res: typedResponse<any>,
    next: NextFunction,
) {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                error: "Invalid id",
            });
        }

        // TODO
        // ดึงข้อมูลจาก database

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
