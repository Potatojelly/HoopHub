import dotenv from "dotenv"
dotenv.config();

function required(key, defaultValue=undefined){
    const value = process.env[key] || defaultValue;
    if(value === null) throw new Error(`Key ${key} is undefined`);
    return value;
}

export const config = {
    jwt : {
        secretKey : required("JWT_SECRET"),
        expireInSec: parseInt(required("JWT_EXPIRES_SEC")),
    },
    bcrpyt : {
        saltRounds : parseInt(required("BCRYPT_SALT_ROUNDS")),
    },
    port : {
        port : parseInt(required("PORT")),
    },
    db: {
        host: required("DB_HOST"),
        user: required("DB_USER"),
        database: required("DB_DATABASE"),
        password: required("DB_PASSWORD"),
    },
    mail : {
        service :required("NODEMAILER_SERVICE"),
        port : parseInt(required("NODEMAILER_PORT")),
        secure: true,
        auth: {
            user: required("NODEMAILER_USER"),
            pass: required("NODEMAILER_PASS"),
        },
    },
}