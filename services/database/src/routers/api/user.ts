import express, { Request, NextFunction } from "express";
import { typedResponse } from "../../types/express";
import { getAll } from "./user/getAll";
import { getByID } from "./user/getByID";
import { getByUsername } from "./user/getByUsername";

const router = express.Router();

router.get("/getAll", getAll);

router.get("/id/:id", getByID);

router.get("/username/:username", getByUsername);



export default router;
