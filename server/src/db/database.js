import pg from "pg";
import dotenv from "dotenv";
import Mongoose from "mongoose";
import {config} from "../config.js";
dotenv.config();

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export const db = pool;

export async function connectMongoDB() {
    return Mongoose.connect(config.mongoDB.host);
}

export function useVirtualId(schema) {
    schema.virtual("id").get(function () {
        return this._id.toString();
    });
    schema.set("toJSON",{virtuals: true});
    schema.set("toObject",{virtuals: true});
}


