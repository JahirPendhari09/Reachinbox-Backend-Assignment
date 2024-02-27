
// sendMail :- get mailTransporter and mailDetails and sent mail to that account
const sendMail = async(mailTransporter,mailDetails)=>{
    try{
        await mailTransporter.sendMail(mailDetails);
        console.log("email send successfully")

    }catch(err){
        console.log(err)
    }
}

// sendMail(mailTransporter,mailDetails)

module.exports ={sendMail}