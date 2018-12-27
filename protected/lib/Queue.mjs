import kue from 'kue';
const queue = kue.createQueue(global && global.config? global.config.kue : null);

export default class Queue {

    static queueNewJob(name, data, priority, removeOnComplete, events) {
        return queue.create(name, data)
            .priority(priority || 0)
            .removeOnComplete( removeOnComplete || true )
            .events(events || false)
            .save();
    }

    static queueProcess(name, cb) {  
        queue.process(name, (job, done) => {
            cb(job.data, done);
        });
    }

    static async queueRemoveAllByName(name) {
        return new Promise(function(resolve, reject) {
            queue.inactive( function( err, ids ) { // others are active, complete, failed, delayed
                let f = (i) => {
                    if(i>=ids.length) {
                        return resolve();
                    }
                    kue.Job.get( ids[i], function( err, job ) {           
                        if(job.type == name)
                            job.remove(() => {
                                f(i+1)
                            })
                        else
                            f(i+1);                        
                    });
                }
                f(0);                
            });
        })
    }
}