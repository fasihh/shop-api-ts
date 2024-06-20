import RequestError from "./request_error";

class InvalidID extends RequestError {
    constructor(message: string = "Invalid is not a number") {
        super(message, 400)
    }
}

export default InvalidID;
