import express from "express";
import nunjucks from "nunjucks";
import bodyParser from "body-parser";
import session from "express-session";
import { getJobRoles } from "./controllers/JobRoleController";
import dotenv from "dotenv";

dotenv.config();

const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(session({ secret: 'SUPER_SECRET', cookie: { maxAge: 28800000 }}));

declare module "express-session" {
  interface SessionData {
    token: string;
  }
}

app.get('/job-roles', getJobRoles);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});