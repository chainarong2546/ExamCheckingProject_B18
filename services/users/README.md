# Image Storage Service

## Environment setup (example)

### GENERAL

1. Server port

    ``` .env
    PORT = "3000"
    ```

2. Allowed Origins Use - By [`cors dependencies`](https://www.npmjs.com/package/cors)

    ``` .env
    ALLOWED_ORIGINS = ["https://exam-checking.com"]
    ```

3. Logging string format - Use By [`morgan dependencies`](https://www.npmjs.com/package/morgan)

    ``` .env
    LOGGER_FORMAT = "short"
    ```

### URL

1. URL string for connect [`redis`](https://redis.io/)

    ``` .env
    REDIS_URL = "redis://exam_checking:123456789@redis.exam-checking.com:6379"
    ```

2. URL string for connect [`database service`](../database)

    ``` .env
    DATABASE_SERVICE_URL = "https://exam-checking.com:3001"
    ```

### TOKEN

1. Secret for encrypt `access token`

    ``` .env
    TOKEN_SECRET_KEY = "9b27b17c95f3120cb73f9ca00a9d61d52a53a6ad22d9b17584f69434e35c899162b8d8b0dca45c0e0004f8fa76354266706bb8ad5e9b28542fef11292ea6ded6"

    ```

2. Secret for encrypt `refresh token`

    ``` .env
    REFRESH_TOKEN_SECRET_KEY = "0c498cce39d2c7433b397f5771d66c672d12563ff4ffea34cba68a2e969862491e2fac648358cff30b2f8e7dc3a57febda3082491c9780f3f8a3b9897a15e213"

    ```

3. Random string is used to encrypt the `access token` and `refresh token`.

    ``` .env
    JWT_SALT = "tLxTFBBekZMFaC5J/SiVVFm4NamQI891EvsLzgH8KD8="
    ```

4. Max age for `access token`

    ``` .env
    TOKEN_MAX_AGE = "3600000" # 1h
    ```

5. Max age for `refresh token`

    ``` .env
    REFRESH_TOKEN_MAX_AGE = "21600000" # 6h
    ```
