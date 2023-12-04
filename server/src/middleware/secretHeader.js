import {config} from "../config.js";

export const secretHeaderMiddleware = (req,res,next) => {
    const secretHeaderValue = req.header["X-CloudFront-Secret-Header"];
    if(secretHeaderValue === config.secretHeader.value) {
        next();
    } else {
        res.status(403).send("Access Denied");
    }
}
