import express from 'express';
import bodyParser from 'body-parser';

import api from './routes';

const app = express();

let port = 4000;

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/../../public'))

app.use('/api', api);

app.listen(port, () => {
    console.log('Express server is listening on port ', port);
});
