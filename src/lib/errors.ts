import { STATUS_CODE } from "./constants.js";

export class CustomError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype); // used when extending a build-in class to ensure the inheritance works properly
    }
}

export class BadRequestError extends CustomError {
    constructor(message?: string) {
        super(message || "Bad Request!", STATUS_CODE.BAD_REQUEST);
    }
}

export class NotFoundError extends CustomError {
    constructor(message?: string) {
        super(message || "Resource not found", STATUS_CODE.NOT_FOUND);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message?: string) {
        super(message || "Unauthorized!", STATUS_CODE.UNAUTHORIZED);
    }
}

export class ForbiddenError extends CustomError {
    constructor(message?: string) {
        super(message || "Forbidden!", STATUS_CODE.FORBIDDEN);
    }
}

export class InternalServerError extends CustomError {
    constructor(message?: string) {
        super(message || "Internal server error!", STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
}

export class ConflictError extends CustomError {
    constructor(message?: string) {
        super(message || "Conflict with existing data!", STATUS_CODE.CONFLICT);
    }
}
