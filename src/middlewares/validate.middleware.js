"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: result.error.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
        });
    }
    req.body = result.data;
    next();
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map