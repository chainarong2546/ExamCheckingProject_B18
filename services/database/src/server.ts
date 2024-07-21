import http from "http";
import net from "net";
import "dotenv/config";

import app from "./app";
import { PORT } from "./config/general";

const port = normalizePort(PORT);

app.set("port", port);

const server = http.createServer(app);

server.listen(port);

server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.syscall !== "listen") {
        throw error;
    }
    console.error(error.message);
    process.exit(1);
});

server.on("listening", () => {
    const addr = server.address();
    const bind =
        typeof addr === "string"
            ? "pipe " + addr
            : "port " + (addr as net.AddressInfo).port;
    console.log(`Server is Listening on ${bind}.`);
});

function normalizePort(val: string) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}
