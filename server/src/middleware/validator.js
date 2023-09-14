import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        return next();
    }   
    console.log(errors);
    const errorMessages = errors.array().map(error => {
        return {
            [error.path]: error.msg,
        }
    });
    return res.status(400).json(errorMessages);
}
