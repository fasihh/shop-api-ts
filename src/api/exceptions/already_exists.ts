import RequestError from "./request_error";

class AlreadyExists extends RequestError {
    constructor(message: string) {
        super(message, 400);
    }
}

export default AlreadyExists;
