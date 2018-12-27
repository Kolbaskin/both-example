// первый импорт нужен только для серверной части
//!#server
import MemStorage from '@root/lib/MemStorage.mjs';
// второй импорт для обоих частей
import Base from '@root/lib/Base.mjs';

export default class dataModel extends Base { 

    //!#client
    constructor(attr) {
        attr.data = {
            users: []
        }
        super(attr);  
        
        // Подписываемся на события на клиенте
        this.on('adduser', (data) => {
            this.users.push(data)
        })
        this.on('removeuser', (data) => {
            this.removeUser(data.id)
        })
        this.getOnlineUsers()
    }

    removeUser(id) {
        for(let i=0;i<this.users.length;i++) {
            if(this.users[i].id == id) {
                this.users.splice(i,1)
                return;
            }
        }
    }

    // получаем список online юзеров
    //!#client
    async getOnlineUsers() {
        // серверный метод можно запросить только после установки соединения
        // по сокету. Подождем этого соединения.
        if(!window.WS.READY) {
            setTimeout(() => {
                this.getOnlineUsers()
            }, 50)
        } else
            // получит список юзеров с сервера
            this.users = await this.$getOnlineUsers();
    }
    
    //!#server
    async $getOnlineUsers() {   
        // на сервере прочитаем пользователей из редиса
        // сначала читаем ключи
        const keys = await MemStorage.getMemKeys('client:*');
        let data = [], name;
        for(let i = 0;i<keys.length;i++) {
            // по ключам получаем значения
            name = await MemStorage.getMemKey(keys[i]);
            if(name) {
                data.push({
                    id: keys[i].substr(7),
                    name
                })
            }
        }
        return data;
    }
}