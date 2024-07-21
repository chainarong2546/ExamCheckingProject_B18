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

1. URL string for connect [`users service`](../users)

    ``` .env
    USERS_SERVICE_URL = "https://exam-checking.com:3000"
    ```
