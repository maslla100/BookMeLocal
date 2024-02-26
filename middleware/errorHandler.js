class ErrorHandler extends Error {
    constructor(statusCode, message, type = 'general') {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.type = type; // New property to categorize the error
    }
}


class ValidationError extends ErrorHandler {
    constructor(message) {
        super(400, message, 'validation');
    }
}

class DatabaseError extends ErrorHandler {
    constructor(message) {
        super(500, message, 'database');
    }
}

class AuthenticationError extends ErrorHandler {
    constructor(message) {
        super(401, message, 'authentication');
    }
}


const handleError = (err, res) => {
    const { statusCode, message, type } = err;

    let response = {
        status: "error",
        statusCode,
        message,
    };

    // You can add specific logic based on error type here
    if (type === 'validation') {
        response = { ...response, details: 'There was a validation error' };
    }

    res.status(statusCode).json(response);
};

module.exports = {
    ErrorHandler,
    ValidationError,
    DatabaseError,
    AuthenticationError,
    handleError
};

