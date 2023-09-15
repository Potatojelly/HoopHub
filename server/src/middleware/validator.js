import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        return next();
    }   
    const errorMessages = {}
    errors.errors.forEach(item=>{
        errorMessages[item.path] = item.msg;
    });

    return res.status(400).json(errorMessages);
}
