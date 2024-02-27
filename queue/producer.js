const { Queue }= require("bullmq");

const notificationQueue = new Queue('email-noti');
//create new queue  and pass name to the queue


// this is async function with the help of this function we can add task's in queue this is dummy data 
async function init(){
    const res = await notificationQueue.add('email to jahir',{
        email:"xyz@gmail.com",
        subject:"Welcome note",
        body:"Welcome to rechinbox"
    });
    console.log("job add to queue", res.id)
}

init()