import { Request, Response, NextFunction } from "express";

export default function globalErrorHandler(
    err: any,
    req: Request,
    res: Response<CustomReturnType>,
    next: NextFunction,
) {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message: message,
        error: {
            name: err.name,
            message: err.message,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        },
    });
    return;
}
