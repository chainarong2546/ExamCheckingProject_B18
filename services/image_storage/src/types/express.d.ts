import { Response } from "express";
import { Send } from "express-serve-static-core";

type resReturn<T = unknown> = {
    success: boolean;
    msg?: string;
    error?: string;
    data?: T;
};

interface typedResponse<T = unknown> extends Response {
    json: Send<resReturn<T>, this>;
}
