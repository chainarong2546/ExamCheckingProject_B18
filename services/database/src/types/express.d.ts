import { Response } from "express";
import { Send } from "express-serve-static-core";

type resReturn<Data = unknown> = {
    success: boolean;
    msg?: string;
    error?: string;
    data?: Data;
};

interface typedResponse<T = unknown> extends Response {
    json: Send<resReturn<T>, this>;
}
