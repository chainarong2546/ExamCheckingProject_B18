import http from "http";
import app from "./app";

const PORT = process.env.PORT || 3002;

const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully.");
    server.close(() => {
        console.log("Process terminated.");
    });
});
