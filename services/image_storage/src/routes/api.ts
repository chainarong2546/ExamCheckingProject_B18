import express, { Request, NextFunction } from "express";
import { typedResponse } from "../types/express";
import { Upload } from "./api/upload";
import { Delete } from "./api/delete";

const router = express.Router();

router.get(
    "/",
    async (req: Request, res: typedResponse, next: NextFunction) => {
        return res.status(200).json({
            success: true,
            msg: "image storage service",
        });
    },
);

router.post("/upload", Upload);

router.delete("/delete/:filename", Delete);

export default router;
