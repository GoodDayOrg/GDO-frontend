import express from "express";
import nunjucks from "nunjucks";
import bodyParser from "body-parser";
import session from "express-session";
import { getLoginForm, logOutUser, postLoginForm } from "./controllers/AuthController";

const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'html');

app.use(express.static('public'));

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

app.get('/login', getLoginForm);
app.post('/login', postLoginForm);
app.get('/logout', logOutUser);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
