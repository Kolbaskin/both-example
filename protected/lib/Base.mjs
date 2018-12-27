import MemStorage from "./MemStorage.mjs";
import Queue from "./Queue.mjs";

export default class Base {

    mix(obj) {       
        const selfMethods = this.getAllMethodNames(this);
        const dstMethods = this.getAllMethodNames(obj);
        
        dstMethods.forEach((m) => {
            if(selfMethods.indexOf(m) == -1) {
                this[m] = obj[m];
            }            
        })
    }

    getAllMethodNames(obj) {
        let methods = [];
        while (obj = Reflect.getPrototypeOf(obj)) {
            let keys = Reflect.ownKeys(obj)
            keys.forEach((k) => {
                methods.push(k);
            });
        }
        return methods;
    }

    async fireEvent() {  

        let items;
        let event = arguments[0], 
            destination = 'all', 
            data, 
            priority,
            k = 1;
        if(Array.isArray(arguments[1]) || typeof arguments[1] == 'string') {
            destination = arguments[1];
            k++;
        }   
        data = arguments[k++] || {};
        priority = arguments[k++] || 0;

        if(destination == 'all') {
            items = await this.getAllAppInstances();            
        } else 
        if(Ext.isArray(destination)) {
            items = await this.getAgentsOnline(destination);
        } else {
            const log = await this.checkAgentOnline(destination);
            if(log) {
                items = ['client:' + destination];
            } 
        }     
        if(items) {
            items.forEach((item) => {
                this.createEventJob(event, item, data, priority)
            })
        }
    }
    
    createEventJob(event, destination, data, priority) {
        Queue.queueNewJob(destination, {
            class: this.__getFilePath__(),
            event,
            data
        });
    }

    async getAllAppInstances() {
        return await MemStorage.getMemKeys('inst:*');
    }

    async getAgentsOnline(agents) {
        let res = [], log;
        for(let i=0;i<agents.length;i++) {
            log = await this.checkAgentOnline(agents[i]);
            if(log)
                res.push('client:'+agents[i]);
        }
        return res;        
    }

    async checkAgentOnline(agent) {
        const res = await MemStorage.existsMemKey('client:' + agent);
        return !!res;
    }

}