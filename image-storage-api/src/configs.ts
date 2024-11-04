import path from "path";

// ==================== GENERAL ====================

// Allowed Origins (Use By cors dependencies)
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
    ? JSON.parse(process.env.ALLOWED_ORIGINS)
    : [];

// Logging string format (Use By morgan dependencies)
export const LOGGER_FORMAT = process.env.LOGGER_FORMAT || "combined";

export const UPLOAD_DIR = path.join(__dirname, "../uploads");

export const SECRET_KEY =
    process.env.SECRET_KEY ||
    "75b251648dc31c92308145eda8f15c71849dc0b42391f1ae4d22295bc4fd6a38f955923d4b88b66af7b2a89cc68f34aec25ea587de70ea8da783cd2f89b4553c";
export const SECRET_SALT =
    process.env.SERVICE_ID ||
    "58209c11a494ad5f9e263bcccef6cf398817690f077aaf7ca207cad1d4106874a97ff342b0ca7000016921ce96ccdcdb3902e7e26899322ad7391553b03a2369";
