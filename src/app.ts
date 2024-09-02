import express from 'express';
import nunjucks from 'nunjucks';
import bodyParser from 'body-parser';
import session from 'express-session';
import { getJobRoles, getSingleJobRole } from './controllers/JobRoleController';
import { formatDate } from './utils/JobRoleUtil';

const app = express();

const env = nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

env.addFilter('formatDate', formatDate);

app.set('view engine', 'html');

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(session({ secret: 'SUPER_SECRET', cookie: { maxAge: 28800000 } }));

declare module 'express-session' {
  interface SessionData {
    token: string;
  }
}
app.get('/', async (req: express.Request, res: express.Response) => {
  res.render('index.html');
});

app.get('/job-roles', getJobRoles);
app.get('/job/:id', getSingleJobRole);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
