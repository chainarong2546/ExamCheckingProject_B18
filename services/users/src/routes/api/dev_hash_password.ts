import { Request, NextFunction } from "express";
import { typedResponse } from "../../types/express";
import { hashPassword } from "../../libs/password";

export async function dev_hash_password(
    req: Request,
    res: typedResponse<{ pass: string }>,
    next: NextFunction,
) {
    try {
        const { password } = req.body;

        const hashPass = await hashPassword(password);

        res.status(200).json({
            success: true,
            data: {
                pass: hashPass,
            },
        });
    } catch (err) {
        return next(err);
    }
}
