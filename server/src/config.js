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
        port: required("DB_POST"),
    },
    mongoDB: {
        host: required("MONGO_DB_HOST"),
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
    aws : {
        accessKeyId: required("AWS_ACCESS_KEY_ID"),
        secretAccessKey: required("AWS_SECRET_ACCESS_KEY_ID"),
        region: required("AWS_REGION"),
    },
    bucket : {
        profile: required("AWS_S3_BUCKET_NAME1"),
        forum: required("AWS_S3_BUCKET_NAME2"),
        chat: required("AWS_S3_BUCKET_NAME3"),
    },
    ff : {
        ffmpeg: required("FFMPEG_PATH"),
        ffprobe: required("FFPROBE_PATH"),
    }
}