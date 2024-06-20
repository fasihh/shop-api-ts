import RequestError from "./request_error";

class ResourceConflict extends RequestError {
    constructor(message: string) {
        super(message, 409);
    }
}

export default ResourceConflict;
