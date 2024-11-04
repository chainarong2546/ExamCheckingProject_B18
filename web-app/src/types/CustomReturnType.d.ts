type CustomReturnType<Data = unknown> = {
    success: boolean;
    message: string;
    error?: { name: string; message?: string; code?: string; stack?: string };
    data?: Data;
};
