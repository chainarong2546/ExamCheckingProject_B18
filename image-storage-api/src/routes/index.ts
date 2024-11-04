import express, { Router } from "express";
import { UPLOAD_DIR } from "../configs";
import { uploadImage } from "./upload";
import { deleteImage } from "./delete";
import authenticateToken from "../middlewares/authenticateToken";

const router = Router();

router.use("/", express.static(UPLOAD_DIR));

router.post("/", uploadImage);

router.delete("/:filename", authenticateToken, deleteImage);

export default router;
