// Server port
export const PORT = process.env.PORT || "3000";

// Allowed Origins (Use By cors dependencies)
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
    ? JSON.parse(process.env.ALLOWED_ORIGINS)
    : [];

// Logging string format (Use By morgan dependencies)
export const LOGGER_FORMAT = process.env.LOGGER_FORMAT || "combined";
