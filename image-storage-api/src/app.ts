import "dotenv/config";
import express, { Application } from "express";
import cors from "./libs/cors";
import helmet from "./libs/helmet";
import morgan from "./libs/morgan";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import rootRoutes from "./routes";

const app: Application = express();

app.set("trust proxy", 1); // Trust first proxy

app.disable("x-powered-by"); // Disabling the X-Powered-By header

// Middlewares
app.use(cors);
app.use(helmet);
app.use(morgan);
app.use(express.json());

// Routes
app.use(rootRoutes);

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({
        success: false,
        message: "API is healthy",
    });
    return;
});

// error 404
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Sorry can't find that",
    });
    return;
});
// Global error handling middleware
app.use(globalErrorHandler);

// Prisma disconnection when shutting down the app
process.on("SIGTERM", async () => {});

export default app;
