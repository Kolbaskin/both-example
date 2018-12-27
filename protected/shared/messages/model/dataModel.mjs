import Base from '../../../lib/Base.mjs';

export default class dataModel extends Base {  __getFilePath__() {return "messages/model/dataModel.mjs"} 

    //
















    reverseMessage () {
        this.message = this.message.split('').reverse().join('')
    }

    setMessage(msg) {
        this.message = msg
    }

    //
    async $testServer(a,b,c) {
        console.log('server method:', {a,b,c})
        this.fireEvent('test', 'all', new Date())
        return {a,b,c}
    }

}
