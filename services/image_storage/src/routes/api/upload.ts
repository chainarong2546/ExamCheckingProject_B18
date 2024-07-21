import { Request, NextFunction } from "express";
import { typedResponse } from "../../types/express";
import { uploadImage } from "../../libs/multer";
import { MulterError } from "multer";

export async function Upload(
    req: Request,
    res: typedResponse<{ filename: string }>,
    next: NextFunction,
) {
    try {
        const uploadSingle = uploadImage.single("image");

        uploadSingle(req, res, (err) => {
            if (err) {
                if (err instanceof MulterError) {
                    return res.status(400).json({
                        success: false,
                        error: `A Multer error occurred when uploading : ${err.message}`,
                    });
                } else if (err) {
                    return res.status(400).json({
                        success: false,
                        error: "An unknown error occurred when uploading",
                    });
                }
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: "An unknown error occurred when uploading",
                });
            }
            res.status(200).json({
                success: true,
                msg: "Upload successful",
                data: { filename: req.file.filename },
            });
        });
    } catch (error) {
        return next(error);
    }
}
