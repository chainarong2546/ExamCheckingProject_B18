import { Request, Response, NextFunction } from "express";
import multer from "../libs/multer";
import { MulterError } from "multer";

export async function uploadImage(
    req: Request,
    res: Response<CustomReturnType<{ filename: string }>>,
    next: NextFunction,
) {
    try {
        const uploadSingle = multer.single("image");

        uploadSingle(req, res, (err) => {
            if (err) {
                if (err instanceof MulterError) {
                    res.status(400).json({
                        success: false,
                        message: "A Multer error occurred when uploading",
                        error: {
                            name: err.name,
                            message: err.message,
                            code: err.code,
                        },
                    });
                    return;
                } else if (err) {
                    res.status(400).json({
                        success: false,
                        message: "An unknown error occurred when uploading",
                    });
                    return;
                }
            }

            if (!req.file) {
                res.status(400).json({
                    success: false,
                    message: "An unknown error occurred when uploading",
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: "Upload successful",
                data: { filename: req.file.filename },
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        return;
    }
}
