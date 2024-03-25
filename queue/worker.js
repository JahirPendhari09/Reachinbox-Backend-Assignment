const {Worker}= require("bullmq")

// create a promise to resolve after 5 sec.
const sendEmail = ()=> new Promise((res,rej)=> setTimeout(()=>res(),5*1000));

// this is worker function it will perform operation's one by one in the queue that we are getting from name (email-noti)

const worker = new Worker("email-noti", async(job) =>{
    try{
        console.log("processing msg")
        await sendEmail();
        console.log(`msg id : ${job.id}`)
        console.log("email sent");
    }catch(err){
        console.log(err)
    }
})
worker()