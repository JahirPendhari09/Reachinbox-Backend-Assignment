const express = require("express");
const app = express();

const { google } = require('googleapis');
const readline = require('readline');

const { connection } = require("./db");
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


// console.log("authUrl",authUrl)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// get oAuth2 code from user input
rl.question('Enter the code : ', (code) => {
  rl.close();
  
  // get access token
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);

    // set credentials for further API requests
    oAuth2Client.setCredentials(token);

    // use the gmail API
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    gmail.users.labels.list({ userId: 'me' }, (err, res) => {
      if (err) return console.error('The API returned an error:', err);
      const labels = res.data.labels;
      if (labels.length) {
        console.log('Labels:');
        labels.forEach((label) => {
          console.log(`- ${label.name}`);
        });
      } else {
        console.log('No labels found.');
      }
    });
  });
});

// Function to process incoming emails and send automated replies
const main = async ()=> {
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

  const gmail = google.gmail({ version: 'v1', auth: gmailOAuth2Client });
  const message = `From: reachinbox@gmail.com>\nTo: ${to}\nSubject: Automated Reply\n\n${reply}`;
  
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: Buffer.from(message).toString('base64')
    }
  });
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