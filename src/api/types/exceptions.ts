export enum ExceptionType {
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    USER_CONFLICT = 'USER_CONFLICT',
    USER_NOT_FOUND = 'USER_NOT',
    INVALID_ID = 'INVALID_ID',
    INVALID_REQUEST = 'INVALID_REQUEST',
    AUTH_FAILURE = 'AUTH_FAILURE',
    UNAUTHORIZED = 'UNAUTHORIZED'
}

export const Exceptions: Record<ExceptionType, { status: number, message: string }> = {
    [ExceptionType.INTERNAL_ERROR]: { status: 500, message: 'An unexpected error occurred' },
    [ExceptionType.USER_CONFLICT]: { status: 409, message: 'User already exists' },
    [ExceptionType.USER_NOT_FOUND]: { status: 404, message: 'User does not exist' },
    [ExceptionType.INVALID_ID]: { status: 400, message: 'User ID is invalid' },
    [ExceptionType.INVALID_REQUEST]: { status: 400, message: 'Invalid request' },
    [ExceptionType.AUTH_FAILURE]: { status: 401, message: 'Auth failure' },
    [ExceptionType.UNAUTHORIZED]: { status: 403, message: 'Unauthorized' }
}
