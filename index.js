const express = require("express");
const { connection } = require("./db");
const { getIncomingEmails, categorizeEmail, generateReply, sendReply } = require("./action");
const app = express();
app.use(express.json());

// Function to process incoming emails and send automated replies
const getEmailAndSendAutoReplay = async ()=> {
  try {
      // Retrieve incoming emails using Gmail API
      const emails = await getIncomingEmails();
      // Iterate through incoming emails
      for (const email of emails){
        // Extract email content
        const emailContent = categorizeEmail(email);
        // Generate automated 
        const reply =  generateReply(emailContent);
        // Send automated reply using Gmail API
        await sendReply(email.sender, reply);
      }
  } catch (err) {
      console.error('Error', err);
  }
}

// call the main logic
getEmailAndSendAutoReplay ();

app.listen(process.env.PORT, async()=>{
    try{
        await connection
        console.log("Server is running")
    }catch(err){
        console.log(err)
    }
})