import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { corsOrigins } from "./libs/cors";
import { helmet } from "./libs/helmet";
import { logger } from "./libs/logger";
import apiRoute from "./routes/api";
import fs from "fs";
import { UPLOAD_DIR } from "./config/url";

const app = express();

app.set("trust proxy", 1); // trust first proxy

app.disable("x-powered-by");

// ==================== Handle middleware ====================
app.use(corsOrigins);
app.use(helmet);
app.use(logger);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// ====================== Handle route =======================

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}
app.use("/image", express.static(UPLOAD_DIR));

// Setup Authentication and use api router
app.use("/api", apiRoute);

// ====================== Handle error =======================
// custom 404
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that");
});

// custom error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

export default app;
