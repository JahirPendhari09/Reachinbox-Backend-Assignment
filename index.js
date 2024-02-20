const express = require("express");
const app = express();

const { google } = require('googleapis');
const { Worker, Queue } = require('bullmq');

const { connection } = require("./db");
app.use(express.json());


// Google OAuth credentials 
const CLIENT_ID = '';
const CLIENT_SECRET = '';
const REDIRECT_URI = `http://localhost:6379/oauth2callback`; 
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];


const GOOGLE_CLIENT_ID = '';
const GOOGLE_CLIENT_SECRET = '';
const GOOGLE_REDIRECT_URI = `http://localhost:6379/oauth2callback`; 

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Generate google OAuth URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});


// Initialize Google OAuth client
const googleOAuth2Client = new google.auth.OAuth2({
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  redirectUri: GOOGLE_REDIRECT_URI,
});

// Initialize Redis connection details
const REDIS_URL = `redis://localhost:6379`;

// Initialize queues
const myQueue = new Queue('myQueue', { connection: REDIS_URL });

// Process function for workers
const processFunction = async (job) => {
//   console.log(`Processing job ${job.id}: ${job.data}`);
  return Promise.resolve();
};

// Create workers to process tasks
const worker = new Worker('myQueue', processFunction, { connection: REDIS_URL });

// Add tasks to the queue
const addTasksToQueue = async () => {
  await myQueue.add('task1', { data: 'Task 1 data' });
  await myQueue.add('task2', { data: 'Task 2 data' });
};

// Schedule tasks to run periodically
const scheduleTasks = async () => {
  await myQueue.add('scheduledTask', { data: 'Scheduled task data' });
};

// Run functions to add tasks and schedule tasks
addTasksToQueue();
scheduleTasks();


// Handle OAuth callback
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    // console.log('Access token:', tokens.access_token);
    // console.log('Refresh token:', tokens.refresh_token);

    // Use the access token to access Gmail API
    const gmail = google.gmail({
      version: 'v1',
      auth: oAuth2Client,
    });

    res.send('OAuth 2.0 authentication successful! You can close this window.');
  } 
  catch (error){
    res.status(500).send('Error retrieving access token');
  }
});


app.listen(process.env.PORT, async()=>{
    try{
        await connection
        console.log("Server is running")
    }
    catch(err){
        console.log(err)
    }
})