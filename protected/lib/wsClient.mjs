// Для каждого WS коннекта заводим отдельный инстанс
// этого класса

import Base from "./Base.mjs";
import MemStorage from "./MemStorage.mjs";
import Queue from "./Queue.mjs";
import clsUsers from "../shared/users/model/dataModel.mjs";

const Users = new clsUsers()

export default class WsClient extends Base {

    constructor(cfg) {         
        super();
        this.apiVersion = '0.1.0';
        this.ws = cfg.ws;
        this.req = cfg.req;
        this.token = cfg.token;
        this.user = cfg.user;

        this.connections = cfg.connections;

        this.onStart();
        this.ws.on('message', (msg) => {
            this.onMessage(msg);
        })
        this.ws.on('close', () => {
            this.onClose();
        })
    }

    // читаем сообщения из сокета
    onMessage(msg) {
        let data;          
        try {
            data =JSON.parse(msg);
        } catch(e) {
            this.error(e);
            return;
        }
        this.checkInputData(data);
    }

    // обработка входных данных
    checkInputData(data) {
        if(data && data.header) {
            if(!this.checkVersion(data.header)) 
                return this.error(`Unsupported version. Current version is ${this.apiVersion}`);
            if(data.header.class && data.header.method) {
                this.runClassMethod(data);
            } else {
                this.error('Invalid header.')
            }
        } else {
            this.error('Invalid input data.');
        }
    }
    // Запускаем серверные методы моделей
    async runClassMethod(data) {
        const cls = await this.importCls(data.header.class, {
            wsClient: this
        })
        const method = (data.header.method[0] == '$'? '':'$') + data.header.method;
        if(cls) {           
            if(!!cls[method]) {
                // request
                if(data.header.id) {
                    try {
                        let result;
                        if(data.data && data.data.arguments) {
                            result = await cls[method].apply(cls, data.data.arguments);
                        } else {
                            result = await cls[method](data.data);
                        }
                        this.sendResponse(data.header.id, 'OK', result);
                    } catch(e) {
                        this.sendResponse(data.header.id, 'Error', e);
                    }
                } else {
                    cls[method](data.data)
                }
            } else {
                // response
            }
        }
    }

    // импортируем модуль
    async importCls(className, data) {
        let module;
        try {
            module = await import(`../shared/${className}`);
        } catch(e) {
            console.log('class err!', e)
            return null;
        }
        return new module.default(data);
    }
    // отправляем ответы в сокет
    sendResponse(id, status, data) {
        this.send({
            header: {
                id,
                status
            },
            data
        })
    }

    // на старте соединения
    async onStart() {
        // генерируем событие adduser для всех пользовательских моделей 
        Users.fireEvent('adduser', {id:this.token, name: this.user})
        // заводим учетку в редисе
        await MemStorage.setMemKey(`client:${this.token}`, this.user);
        // подписываемся на задачи в очереди для этого коннекта
        await Queue.queueProcess(`client:${this.token}`, async (data, done) => {
            // по задачам из очереди генерируем события
            const res = await this.prepareClientEvents(data);
            done(res);
        })
    }
    // закрытие коннекта
    onClose() {
        // генерируем событие removeuser для всех пользовательских моделей
        Users.fireEvent('removeuser', {id:this.token, user: this.user})
        // убираем учетку из редиса
        MemStorage.delMemKey(`client:${this.token}`);
        delete this.connections[this.token];
    }

    error(e) {
        this.send({
            header: {
                status: 'Error'
            },
            data: e
        })
    }

    send(data) {
        if(!!data.header) {
            data.header.version = this.apiVersion;
            data.header.tm = new Date().getTime();
        }        
        this.ws.send(JSON.stringify(data));
    }

    checkVersion(data) {
        return true;
    }

    async prepareClientEvents(data) {
        this.send({
            header: {
                class: data.class,
                event: data.event
            },
            data: data.data
        })
        return true;
    }

}