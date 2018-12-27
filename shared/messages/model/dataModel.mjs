import Base from '@root/lib/Base.mjs';

export default class dataModel extends Base { 

    //!#client
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

    //!#server
    async $testServer(a,b,c) {
        console.log('server method:', {a,b,c})
        this.fireEvent('test', 'all', new Date())
        return {a,b,c}
    }

}
