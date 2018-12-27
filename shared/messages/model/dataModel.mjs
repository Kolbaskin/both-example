import Base from '@root/lib/Base.mjs';

export default class dataModel extends Base { 

    //!#client
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
    
    //!#server
    async $sendMessage(text) {
        // генерируем событие newmessage для всех подключенных пользователей
        this.fireEvent('newmessage', 'all', {
            date: new Date(),
            text
        })
        return true;
    }
}
