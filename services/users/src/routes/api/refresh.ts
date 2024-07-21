import { Request, NextFunction } from "express";
import { typedResponse } from "../../types/express";
import { jwtDecode, jwtEncode } from "../../libs/jwt";
import { TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "../../config/token";

export async function refresh(
    req: Request,
    res: typedResponse<null>,
    next: NextFunction,
) {
    try {
        const refreshCookie = req.cookies.refresh;
        if (!refreshCookie) {
            return res.status(401).json({
                success: false,
                error: "Invalid token",
            });
        }

        const payload = await jwtDecode(refreshCookie, "refresh");
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

        const token = await jwtEncode(
            { userID: payload.userID, role: payload.role },
            "token",
        );
        const refresh = await jwtEncode(
            { userID: payload.userID, role: payload.role },
            "refresh",
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: TOKEN_MAX_AGE,
        });
        res.cookie("refresh", refresh, {
            httpOnly: true,
            secure: false,
            maxAge: REFRESH_TOKEN_MAX_AGE,
        });

        return res.status(200).json({
            success: true,
            msg: "Login success by refresh token",
        });
    } catch (err) {
        return next(err);
    }
}
