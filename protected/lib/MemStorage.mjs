import redis from "redis";
const redisClient = redis.createClient(global && global.config? global.config.redis : null);

export default class MemStorage {    
    static setMemKey(key, val, ex) {
        return  new Promise((resolve, reject) => {
            if(ex) {
                redisClient.set(key, val, 'EX', ex, (e,d) => {
                    if(e)
                        reject(e)
                    else
                        resolve(d)
                });
            } else {
                redisClient.set(key, val, (e,d) => {
                    if(e)
                        reject(e)
                    else
                        resolve(d)
                });
            }
        })
    }

    static getMemKey(key) {
        return  new Promise((resolve, reject) => {
            redisClient.get(key, (e,d) => {
                if(e)
                    reject(e)
                else
                    resolve(d)
            });
        })
    }

    static delMemKey(key) {
        return  new Promise((resolve, reject) => {
            redisClient.del(key, (e,d) => {
                if(e)
                    reject(e)
                else
                    resolve(d)
            });
        })
    }

    static getMemKeys(query) {
        return  new Promise((resolve, reject) => {
            redisClient.keys(query, (e,d) => {
                if(e)
                    reject(e)
                else
                    resolve(d)
            });
        })
    }

    static existsMemKey(key) {
        return  new Promise((resolve, reject) => {
            redisClient.exists(key, (e,d) => {
                if(e)
                    reject(e)
                else
                    resolve(!!d)
            });
        })
    }

}