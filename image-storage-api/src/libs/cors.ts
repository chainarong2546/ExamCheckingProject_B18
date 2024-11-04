import cors, { CorsOptionsDelegate } from "cors";
import { ALLOWED_ORIGINS } from "../configs";

const allowedOrigins = ALLOWED_ORIGINS;

const corsOptionsDelegate: CorsOptionsDelegate = (req, callback) => {
    // callback(null, { origin: true, credentials: true }); 
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        callback(null, { origin: true, credentials: true }); // Allow the request
    } else {
        callback(null, { origin: false }); // Block the request
    }
};

export default cors(corsOptionsDelegate);
