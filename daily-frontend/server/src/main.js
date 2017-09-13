import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import session from 'express-session';
import morgan from 'morgan';

import api from './routes';
import db from './models';

const app = express();

const port = 4000; 

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

// MongoDB Connection Info
db.connect();

// use session
app.use(session({
    secret: 'DailyNote$1$1$234',
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
