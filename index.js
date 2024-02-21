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

// get route for welcome note
app.get("/",async(req,res)=>{
    try{
        res.status(200).send("Welcome to Razorsharp E-mail Outreach tool powered by AI")
    }catch(err){
        res.status(500).send({"error":err})
    }
})

// post route for processing emails
app.post("/process-emails", async (req, res) => {
    try {
        // Call the main logic to process emails
        await getEmailAndSendAutoReplay();
        res.status(200).send("Email processing initiated");
    } catch (err) {
        console.error('Error processing emails', err);
        res.status(500).send("Error processing emails");
    }
});

app.listen(process.env.PORT, async()=>{
    try{
        await connection
        console.log("Server is running")
    }catch(err){
        console.log(err)
    }
})