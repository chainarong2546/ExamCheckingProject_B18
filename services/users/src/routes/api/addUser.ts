import { Request, NextFunction } from "express";
import { typedResponse } from "../../types/express";

export async function addUser(
    req: Request,
    res: typedResponse<{ userId: string }>,
    next: NextFunction,
) {
    try {
        const { username } = req.body;
    } catch (err) {
        return next(err);
    }
}
