import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import { UPLOAD_DIR } from "../config/url";

// Setting storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = UPLOAD_DIR;
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});

// File filter function
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
) => {
    try {

        // To accept the file pass `true`, like so:
        return cb(null, true);

        // To reject this file pass `false`, like so:
        return cb(null, false);
    } catch (error) {
        cb(new Error(`Upload file error: ${error}`));
    }
};

export const uploadImage = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});
