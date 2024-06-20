import RequestError from "./request_error";

class NotFound extends RequestError {
    constructor(message: string) {
        super(message, 404);
    }
}

export default NotFound;
