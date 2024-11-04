import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import { UPLOAD_DIR } from "../configs";
import fs from "fs";

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

// Setting storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const ext =
            file.mimetype === "application/pdf"
                ? ".pdf"
                : file.mimetype === "image/jpeg"
                ? ".jpeg"
                : file.mimetype === "image/jpg"
                ? ".jpg"
                : file.mimetype === "image/png"
                ? ".png"
                : null;
        if (!ext) {
            cb(new Error("File type not support."), "");
        }
        cb(null, `${Date.now()}${ext}`);
    },
});

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    try {
        // To accept the file pass `true`, like so:
        return cb(null, true);

        // To reject this file pass `false`, like so:
        return cb(null, false);
    } catch (error) {
        cb(new Error(`Upload file error: ${error}`));
    }
};

export default multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});
