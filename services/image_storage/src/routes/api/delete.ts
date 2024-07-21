import { Request, NextFunction } from "express";
import { typedResponse } from "../../types/express";
import path from "path";
import fs from "fs";
import { UPLOAD_DIR } from "../../config/url";

export async function Delete(
    req: Request,
    res: typedResponse<{ filename: string }>,
    next: NextFunction,
) {
    try {
        const filename = req.params.filename;
        const filepath = path.join(UPLOAD_DIR, filename);

        fs.unlink(filepath, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    error: "Delete failed : err.message",
                });
            }
            return res.status(200).json({
                success: true,
                msg: "Delete successful",
                data: {
                    filename: filename,
                },
            });
        });
    } catch (error) {
        return next(error);
    }
}
