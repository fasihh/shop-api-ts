import RequestError from "./request_error";

class UserAlreadyExists extends RequestError {
    constructor(message: string = 'A user with this name already exists') {
        super(message, 400);
    }
}

export default UserAlreadyExists;
