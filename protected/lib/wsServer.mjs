import expressWs from "express-ws";
import redis  from "redis";
import uuidv4 from 'uuid/v4';
import kue from "kue";
import wsClient from "./wsClient.mjs";

const client = redis.createClient(global && global.config? global.config.redis : null);
const queue = kue.createQueue(global && global.config? global.config.kue : null);
const sessionKey = uuidv4();

client.set(`inst:${sessionKey}`, "1", 'EX', 10);

setInterval(() => {
    client.set(`inst:${sessionKey}`, "1", 'EX', 10);
}, 5000);

let connections = {}

let addWsConnection = (data, ws, req) => {
  
    if(connections[data.token]) {
        ws.send('Error! This agent is already connected.')
        ws.close();
        return;
    }

    connections[data.token] = new wsClient({
        ws,
        req,
        token: data.token,
        user: data.user,
        connections
    });
}

queue.process(`inst:${sessionKey}`, (job, done) => {
    for(let i in connections) {
        connections[i].prepareClientEvents(job.data)
    }
    done();
});

export default function(app) {
    expressWs(app);
    app.ws('/both', function(ws, req) { 
        addWsConnection(req.query, ws, req);        
    });
}