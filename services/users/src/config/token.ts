// Secret for encrypt `access token`
export const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY || "b443038b7adc20a15f0e121e79857d27d73ff027cf5e2183abdf681ca51cafd3";

// Secret for encrypt `refresh token`
export const REFRESH_TOKEN_SECRET_KEY =
    process.env.REFRESH_TOKEN_SECRET_KEY || "49d1724352d058ae3af3b1daa4e74cd47b6584b2dc56cdf31958db6d86eb9330";

// Random string is used to encrypt the `access token` and `refresh token`.
export const JWT_SALT = process.env.JWT_SALT || "this is a exam_checking project";

// Max age for `access token`
export const TOKEN_MAX_AGE = process.env.TOKEN_MAX_AGE
    ? parseInt(process.env.TOKEN_MAX_AGE, 10)
    : 1000 * 60 * 60 * 1; // 1H

// Max age for `refresh token`
export const REFRESH_TOKEN_MAX_AGE = process.env.REFRESH_TOKEN_MAX_AGE
    ? parseInt(process.env.REFRESH_TOKEN_MAX_AGE, 10)
    : 1000 * 60 * 60 * 6; // 6H
