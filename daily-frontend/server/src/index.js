const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const morgan = require('morgan');

const api = require('./routes');
const db = require('./models');

const app = express();

const host = process.env.NODE_ENV !== 'production' ? '127.0.0.1' : '0.0.0.0';
const port = process.env.NODE_ENV !== 'production' ? 4000 : 5100;

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

const publicFolder = process.env.NODE_ENV === 'production' ? './../../build' : './../../public';

app.use('/', express.static(path.join(__dirname, publicFolder)));

app.use('/api', api);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, publicFolder + '/index.html'));
});

/* handle error */
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, host, () => {
	console.log('Express server is listening on port ', port);
});
