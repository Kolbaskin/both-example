import {uuidv4} from '/lib/util.mjs';

export default class WSocket {

    constructor(cfg) {
        //super();
        this.callbacks = {}
        this.READY = false;
        this.token = cfg.token; 
        this.user = cfg.user;        
        this.connect();
    }

    reconnect() {
        if(!!this.reconnectTm) clearTimeout(this.reconnectTm);
        this.reconnectTm = setTimeout(() => {
            this.connect();
        }, 1000)
    }

    connect() {
        this.ws = new WebSocket(this.getUrl(this.token));
        
        this.ws.onopen = () => {
        
            this.READY = true;
        };
        
        this.ws.onclose = (event) => {
            if (event.wasClean) {
                
            } else {
                
                this.reconnect()
            }
        };
          
        this.ws.onmessage = (event) => {
            const data = this.parseData(event.data);           
            if(data) {
                
                this.doAction(data);
            }
        };
          
        this.ws.onerror = (error) => {
            this.reconnect();
        };
    }

    parseData(msg) {
        try {
            const data = JSON.parse(msg);
            if(data && data.header) 
                return data;
        } catch(e) {
            console.log(msg)
            //this.error(e)
        }
        return;
    }

    doAction(data) {
        if(data && data.header) {
            if(data.header.status) {
                // response
                this.doResponse(data);
            } else
            if(data.header.event) {
                this.doEvent(data);
            } 
        }
    }

    doEvent(data) {
        if(
            data.header.class
        ) {
            if(window.clsInstances && window.clsInstances[data.header.class]) {
                for(let i in window.clsInstances[data.header.class]) {
                    window.clsInstances[data.header.class][i].fireEvent(data.header.event, data.data)
                }
            }
        }
    }

    sendError(data, id) {
        this.send({
            header: {
                id,
                status: 'Error'
            },
            data
        })
    }

    sendResponse(data, id) {
        this.send({
            header: {
                id,
                status: 'OK'
            },
            data
        })
    }

    send(data) {
        this.ws.send(JSON.stringify(data))
    }

    getUrl(token) {
        const uriArr = location.href.split('/')
            ,host = uriArr[2]
            ,protocole = uriArr[0] == 'https:'? 'wss':'ws';  
        return protocole + "://" + host + "/both?token=" + encodeURIComponent(token)+'&user='+encodeURIComponent(this.user);
    }

    doResponse(data) {
        if(data.header.id && this.callbacks[data.header.id]) {
            this.callbacks[data.header.id](data.data);
            delete this.callbacks[data.header.id];
        }
    }

    callServerMethod(cls, method, data) {
        return new Promise((resolve, reject) => {
            const token = uuidv4();
            this.callbacks[token] = resolve;
            this.send({
                header: {
                    class: cls,
                    method,
                    id: token
                },
                data
            })           
        })
    }   
    
    
}
