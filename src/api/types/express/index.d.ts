import { JwtPayload } from "jsonwebtoken";
import { RequestQuery } from "../global";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
            queryParams: RequestQuery;
            id?: number;
        }
    }
}
