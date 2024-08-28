import express from "express";
import nunjucks from "nunjucks";
import bodyParser from "body-parser";
import session from "express-session";
import { getLoginForm, getRegisterForm, postLoginForm } from "./controllers/AuthController";
import { allowRoles } from "./middleware/AuthMiddleware";

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
app.get('/register', allowRoles(), getRegisterForm);


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
