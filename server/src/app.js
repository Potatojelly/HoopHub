import express, { application } from "express";
import "express-async-errors";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import authRouter from "./router/auth.js";
import profileRouter from "./router/profile.js";
import retrRouter from "./router/retr.js";
import searchRouter from "./router/search.js";
import friendRouter from "./router/friend.js";
import forumRouter from "./router/forum.js";
import cookieParser from 'cookie-parser';
import {db} from "./db/database.js";

const app = express();

const corsOption = {
    origin:"http://localhost:3000",
    optionSuccessStatus: 200,
    credentials: true,
}

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors(corsOption));
app.use(helmet());


app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/retrieve", retrRouter);
app.use("/search", searchRouter);
app.use("/friend", friendRouter);
app.use("/forum", forumRouter);

app.use((req,res,next) => {
    res.sendStatus(404);
});

app.use((error,req,res,next) => {
    console.error(error);
    res.sendStatus(500);
});

db.connect(err => {
    if(err) console.log(err);
    else console.log("PostgresSQL Connection Success");
}) 


let port = 8080;

app.listen(port, async() => {
    console.log(`Server running at http://localhost:${port}`);
});

