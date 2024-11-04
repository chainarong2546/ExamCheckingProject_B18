import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import path from "path";
import { LOGGER_FORMAT } from "../configs";

const accessLogStream = createStream("access.log", {
    interval: "1d",
    path: path.join(__dirname, "../../logs"),
});

export default morgan(LOGGER_FORMAT || "combined", { stream: accessLogStream });
