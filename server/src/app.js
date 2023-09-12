import express, { application } from "express";
import morgan from "morgan";
import helmet from "helmet";
import mainRouter from "./router/main.js";
import {db} from "./db/database.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());


app.use("/", mainRouter);

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

db.query("SELECT NOW()", (err,res) => {
    console.log(res);
})
let port = 8080;

app.listen(port, async() => {
    console.log(`Server running at http://localhost:${port}`);
});

