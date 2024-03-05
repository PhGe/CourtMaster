//testError.js

function throwError(req, res, next) {
    // Simulate an error
    next(new Error('Test error'));
}

export { throwError };