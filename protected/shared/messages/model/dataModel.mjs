import Base from '../../../lib/Base.mjs';

export default class dataModel extends Base {  __getFilePath__() {return "messages/model/dataModel.mjs"} 

    //












    //отправляем сообщение на сервер
    async sendMessage(e) {
        await this.$sendMessage(this.msg);
        this.msg = '';
    }
    
    //
    async $sendMessage(text) {
        // генерируем событие newmessage для всех подключенных пользователей
        this.fireEvent('newmessage', 'all', {
            date: new Date(),
            text
        })
        return true;
    }
}
