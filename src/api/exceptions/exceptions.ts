export enum ExceptionType {
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    USERNAME_CONFLICT = 'USERNAME_CONFLICT',
    CART_CONFLICT = 'CART_CONFLICT',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
    CART_NOT_FOUND = 'CART_NOT_FOUND',
    CART_ITEM_NOT_FOUND = 'CART_ITEM_NOT_FOUND',
    INVALID_ID = 'INVALID_ID',
    INVALID_REQUEST = 'INVALID_REQUEST',
    AUTH_FAILURE = 'AUTH_FAILURE',
    INVALID_TOKEN = 'INVALID_TOKEN',
    UNAUTHORIZED = 'UNAUTHORIZED',
}

export const Exceptions: Record<ExceptionType, { status: number, message: string }> = {
    [ExceptionType.INTERNAL_ERROR]: { status: 500, message: 'An unexpected error occurred' },
    [ExceptionType.USERNAME_CONFLICT]: { status: 409, message: 'User with this name already exists' },
    [ExceptionType.CART_CONFLICT]: { status: 409, message: 'User already has a cart that has not been checked out' },
    [ExceptionType.USER_NOT_FOUND]: { status: 404, message: 'User does not exist' },
    [ExceptionType.ITEM_NOT_FOUND]: { status: 404, message: 'Item does not exist' },
    [ExceptionType.CART_NOT_FOUND]: { status: 404, message: 'Cart does not exist' },
    [ExceptionType.CART_ITEM_NOT_FOUND]: { status: 404, message: 'Cart item does not exist' },
    [ExceptionType.INVALID_ID]: { status: 400, message: 'ID is invalid' },
    [ExceptionType.INVALID_REQUEST]: { status: 400, message: 'Invalid request' },
    [ExceptionType.AUTH_FAILURE]: { status: 401, message: 'Auth failure' },
    [ExceptionType.UNAUTHORIZED]: { status: 403, message: 'Unauthorized' },
    [ExceptionType.INVALID_TOKEN]: { status: 401, message: 'Auth failure: token is not provided' }
};
