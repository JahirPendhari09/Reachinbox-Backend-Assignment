const express = require("express");
const { google } = require('googleapis');
const { connection } = require("./db");

const app = express();
app.use(express.json());

// Scopes for accessing Gmail API
const SCOPES = ['https://mail.google.com/'];

const oAuth2Client = new google.auth.OAuth2(
  `${process.env.CLIENT_ID}`,
  `${process.env.CLIENT_SECRET}`,
  `${process.env.REDIRECT_URI}`
);

// generate google OAuth URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log("authUrl",authUrl)

// Function to retrieve incoming emails using Gmail API
const getIncomingEmails = async ()=> {
    try{
      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
      const response = await gmail.users.messages.list({ userId: 'me', q: 'is:unread' });
      return response.data.messages;
    }
    catch(err){
      console.error('Error :', err);
    }
}

// Function to categorize the email based on its content
const  categorizeEmail = (email) =>{
  const { body } = email;
  if(body.toLowerCase().includes('interested')){
    return 'Interested';
  }else if(body.toLowerCase().includes('not interested')){
    return 'Not Interested';
  }else{
    return 'More Information';
  }
}

// Function to generate automated reply based on category 
const  generateReply =  (category) => {
  switch (category) {
    case 'Interested':
      return 'Thank you for your interest! Would you be available for a demo call? Please suggest a time that works for you.';
    case 'Not Interested':
      return 'Thank you for considering our product/service. If you have any further questions in the future, feel free to reach out.';
    case 'More Information':
      return `Thank you for reaching out.`;
    default:
      return `Thank you for your email. We'll get back to you.`;
  }
}

// Function to send automated reply using Gmail API
const sendReply = async (to, reply)=> {

  const gmail = google.gmail({ version: 'v1', auth: gmail.oAuth2Client });
  const message = `From: reachinbox@gmail.com>\nTo: ${to}\nSubject: Automated Reply\n\n${reply}`;
  
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: Buffer.from(message).toString('base64')
    }
  });
}

// Function to process incoming emails and send automated replies
const main = async ()=> {
  try {
      // Retrieve incoming emails using Gmail API
      const emails = await getIncomingEmails();
      // console.log(emails,"emails")

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
// Call the main 
main();

app.listen(process.env.PORT, async()=>{
    try{
        await connection
        console.log("Server is running")
    }catch(err){
        console.log(err)
    }
})