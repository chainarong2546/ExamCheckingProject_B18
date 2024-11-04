import { Request, Response, NextFunction } from "express";
import { jwtDecode } from "../utils/jwt";

const authenticateToken = async (
    req: Request,
    res: Response<CustomReturnType>,
    next: NextFunction,
) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        res.status(401).json({
            success: false,
            message: "Token not found",
        });
        return;
    }
    const decoded = await jwtDecode(token);

    if (decoded == null) {
        res.status(403).json({
            success: false,
            message: "Invalid token",
        });
        return;
    }
    req.headers["X_AUTH"] = JSON.stringify(decoded);
    next();
    return;
};

export default authenticateToken;
