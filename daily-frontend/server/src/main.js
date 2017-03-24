import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import session from 'express-session';

import api from './routes';

const app = express();

const port = 4000;

app.use(bodyParser.json());

app.use(session({
    secret: 'DailyNote1$1$234',
    resave: false,
    saveUninitialized: true
}));

app.use('/', express.static(path.join(__dirname, './../../public')));

app.use('/api', api);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../../public/index.html'));
});

/* handle error */
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
	console.log('Express server is listening on port ', port);
});
