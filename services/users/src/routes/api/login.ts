import { Request, NextFunction } from "express";
import axios from "axios";

import { jwtEncode } from "../../libs/jwt";
import { comparePassword } from "../../libs/password";
import { typedResponse } from "../../types/express";
import { TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "../../config/token";
import { DATABASE_SERVICE_URL } from "../../config/url";

export async function login(
    req: Request,
    res: typedResponse<null>,
    next: NextFunction,
) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: "Invalid username or password",
            });
        }

        if (typeof username !== "string" || typeof password !== "string") {
            return res.status(400).json({
                success: false,
                error: "Username or Password is not string",
            });
        }

        const loginData: loginData = { username, password };
        const fetchUser = await axios.get<resAxios<loginData_Axios>>(
            `${DATABASE_SERVICE_URL}/api/user/username/${loginData.username}`
        );

        if (fetchUser.status < 200 || fetchUser.status > 299) {
            return res.status(fetchUser.status).json({
                success: false,
                error: fetchUser.data.error,
            });
        }

        if (fetchUser.data.success != true) {
            return res.status(401).json({
                success: false,
                error: "The username or password is incorrect.",
            });
        }

        const userData = fetchUser.data.data;
        if (
            !userData ||
            !userData.password ||
            !userData.uuid ||
            !userData.role
        ) {
            return res.status(500).json({
                success: false,
                error: "User data not found",
            });
        }

        const passCheck = await comparePassword(
            loginData.password,
            userData.password,
        );
        if (!passCheck) {
            return res.status(401).json({
                success: false,
                error: "The username or password is incorrect.",
            });
        }

        const token = await jwtEncode(
            { userID: userData.uuid, role: userData.role },
            "token",
        );
        const refresh = await jwtEncode(
            { userID: userData.uuid, role: userData.role },
            "refresh",
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: TOKEN_MAX_AGE,
        });
        res.cookie("refresh", refresh, {
            httpOnly: true,
            secure: true,
            maxAge: REFRESH_TOKEN_MAX_AGE,
        });

        return res.status(200).json({
            success: true,
            msg: "Login success",
        });
    } catch (err) {
        return next(err);
    }
}
