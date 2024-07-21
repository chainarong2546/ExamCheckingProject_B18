import { Request, NextFunction } from "express";
import { typedResponse } from "../../types/express";
import { jwtDecode } from "../../libs/jwt";

export async function verify(
    req: Request,
    res: typedResponse<responseData_verify>,
    next: NextFunction,
) {
    try {
        const { token, type } = req.body;

        if (!token || typeof token !== "string") {
            return res.status(401).json({
                success: false,
                error: "Invalid token",
            });
        }

        const type2 = type && type == "refresh" ? "refresh" : "token";
        const payload = await jwtDecode(token, type2);
        if (!payload) {
            return res.status(401).json({
                success: false,
                error: "Token verification failed.",
            });
        }

        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
            return res.status(401).json({
                success: false,
                error: "Token has expired",
            });
        }

        return res.status(200).json({
            success: true,
            msg: "The token has been verified.",
            data: {
                userId: payload.userID,
                role: payload.role,
            },
        });
    } catch (err) {
        return next(err);
    }
}
