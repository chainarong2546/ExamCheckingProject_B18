import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { UPLOAD_DIR } from "../configs";

export const deleteImage = async (
    req: Request,
    res: Response<CustomReturnType<undefined>>,
    next: NextFunction,
) => {
    const { filename } = req.params;
    const filepath = path.join(UPLOAD_DIR, filename);
    try {
        if (fs.existsSync(filepath)) {
            fs.unlink(filepath, (err) => {
                if (err) {
                    res.status(400).json({
                        success: false,
                        message: `Delete failed.`,
                        error: {
                            name: err.name,
                            message: err.message,
                            code: err.code,
                        },
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "Delete successed.",
                });
                return;
            });
        }
        res.status(400).json({
            success: false,
            message: "File does not exist.",
        });
        return;
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
        return;
    }
};
