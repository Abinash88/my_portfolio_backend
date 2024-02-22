export const ErrorMiddleware = (err, req, res) => {
    console.log(err, "middleware error");
};
export const ErrorMessage = ({ statusCode = 500, message = "Internal Server Error!", res, }) => {
    return res.status(statusCode).json({ success: false, message });
};
export const ErrorMiddleWareGenerator = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        ErrorMessage({ res, message: `${err.message} internal Error message` });
    });
};
//# sourceMappingURL=ErrorMiddleware.js.map