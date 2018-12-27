import Base from '/lib/Base.mjs';

export default class dataModel extends Base {  __getFilePath__() {return "messages/model/dataModel.mjs"} 

    //
    constructor(attr) {
        attr.data = {
            message: 'Hello Vue!'
        }
        super(attr)  
        
        this.on('test', (data) => {
            console.log('ON test:', data)
        })

        setTimeout(async ()=>{
            const res = await this.$testServer(1,2,3)
            console.log('RES:', res)
        },1000)      
    }

    reverseMessage () {
        this.message = this.message.split('').reverse().join('')
    }

    setMessage(msg) {
        this.message = msg
    }

    //



async $testServer() {return await this.__runSharedFunction("$testServer",arguments)}


}
