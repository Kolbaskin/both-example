import express from 'express';
import bodyParser from 'body-parser';
import wsServer from './lib/wsServer.mjs';
const app = express();

wsServer(app);

express.static.mime.define({'application/javascript': ['js','mjs']});

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public')); 

const server = app.listen(3000, () => {
    console.log('server is running at %s', server.address().port);
});