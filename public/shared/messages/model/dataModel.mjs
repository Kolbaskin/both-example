import Base from '/lib/Base.mjs';

export default class dataModel extends Base {  __getFilePath__() {return "messages/model/dataModel.mjs"} 

    //
    constructor(attr) {
        attr.data = {
            msg: '',
            messages: []
        }
        super(attr);
        // подписываемся на новые сообщения        
        this.on('newmessage', (data) => {
            this.messages.push(data)
        })
    }

    //отправляем сообщение на сервер
    async sendMessage(e) {
        await this.$sendMessage(this.msg);
        this.msg = '';
    }
    
    //






async $sendMessage() {return await this.__runSharedFunction("$sendMessage",arguments)}

}
