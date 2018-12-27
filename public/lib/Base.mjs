import {uuidv4} from "/lib/util.mjs";

class Base extends Vue {

    
    constructor(cfg) {
        super(cfg);
        
        this.createInstance()

    }
   
    createInstance() {
        const name = this.__getFilePath__();
        this.id = uuidv4();
        if(!window.clsInstances)
            window.clsInstances = {};
        if(!window.clsInstances[name])
            window.clsInstances[name] = {};
        window.clsInstances[name][this.id] = this;
    }

    destroy() {
        if(window.clsInstances && window.clsInstances[name] && window.clsInstances[name][this.id])
            delete window.clsInstances[name][this.id];
        delete this;
    }

    async __runSharedFunction(name, args) {
        let data = [];
        for(let i=0;i<args.length;i++) {
            data.push(args[i]);
        }

        const result = await window.WS.callServerMethod(
            this.__getFilePath__(),
            name,
            { arguments: data }
        );
        return result;
    }

    fireEvent(event, data) {
        if(!!this.listeners && !!this.listeners[event]) {
            this.listeners[event].forEach((f) => {
                f(data)
            })
        }
    }

    on(event, f) {
        if(!this.listeners) this.listeners = {}
        if(!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(f)
    }

}

export default Base;