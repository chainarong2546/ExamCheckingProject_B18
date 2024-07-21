import express, { Request, NextFunction } from "express";
import { typedResponse } from "../types/express";
import { login } from "./api/login";
import { verify } from "./api/verify";
import { refresh } from "./api/refresh";
import { addUser } from "./api/addUser";
import { dev_hash_password } from "./api/dev_hash_password";

const router = express.Router();

router.get(
    "/",
    async (req: Request, res: typedResponse, next: NextFunction) => {
        return res.status(200).json({
            success: true,
            msg: "users service",
        });
    },
);

// For user
router.post("/login", login);

router.post("/verify", verify);

router.post("/refresh", refresh);



// For admin
router.post("/addUser", addUser);

// For Service
router.post("/getRole", addUser);

// For Dev
router.post("/dev_hash_password", dev_hash_password);

export default router;
