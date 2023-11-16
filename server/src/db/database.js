import pg from "pg";
import Mongoose from "mongoose";
import {config} from "../config.js";

const pool = new pg.Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port:  config.db.port,
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


