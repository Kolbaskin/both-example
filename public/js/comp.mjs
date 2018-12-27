//!#server
import Base from "./lib/Base.mjs";

export default class Component extends Base {

    constructor(attr) {
        attr.data = {
            message: 'Hello Vue 123!'
        }
        super(attr)        
    }

    reverseMessage () {
        this.message = this.message.split('').reverse().join('')
    }

    setMessage(msg) {
        this.message = msg
    }

    //!#server
    testServer() {
        console.log('server method')
    }

}