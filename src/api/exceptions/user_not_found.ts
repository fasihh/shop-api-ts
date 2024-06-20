import RequestError from "./request_error";

class UserNotFound extends RequestError {
    constructor(message: string = 'User does not exist') {
        super(message, 404);
    }
}

export default UserNotFound;
