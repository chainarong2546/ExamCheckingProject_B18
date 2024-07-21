# Database Service

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

2. URL string for connect [`postgresql`](https://www.postgresql.org/)

    ``` .env
    POSTGRESQL_URL = "postgresql://exam_checking:123456789@postgresql.exam-checking.com:5432/exam_checking_project?schema=public"
    ```
