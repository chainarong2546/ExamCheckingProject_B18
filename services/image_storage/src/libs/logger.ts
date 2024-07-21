import morgan from "morgan";
import path from "path";
import { createStream } from "rotating-file-stream";
import { LOGGER_FORMAT } from "../config/general";

const accessLogStream = createStream("access.log", {
    interval: "1d", // Rotate files every day
    path: path.join(__dirname, "../../logs"),
});

export const logger = morgan(LOGGER_FORMAT, { stream: accessLogStream });
