import express, { Request, NextFunction } from "express";
import { typedResponse } from "../types/express";

import userRouter from "./api/user";
import groupRouter from "./api/group";
import answerRouter from "./api/answer";

const router = express.Router();

router.get(
    "/",
    async (req: Request, res: typedResponse, next: NextFunction) => {
        return res.status(200).json({
            success: true,
            msg: "database service",
        });
    },
);

router.use("/user", userRouter);

router.use("/group", userRouter);

router.use("/answer", userRouter);

export default router;
