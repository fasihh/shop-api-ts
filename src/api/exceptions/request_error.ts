import { ExceptionType, Exceptions } from "../types/exceptions";

class RequestError extends Error {
    public status?: number;

    constructor(type: ExceptionType = ExceptionType.INTERNAL_ERROR) {
        const { status, message } = Exceptions[type];
        super(message)
        this.name = type;
        this.status = status;
        Error.captureStackTrace(this, this.constructor)
    }
}

export default RequestError;
export type { RequestError }; 
