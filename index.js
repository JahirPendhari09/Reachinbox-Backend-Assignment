const express = require("express");
const { connection } = require("./db");

// for sending emails
// const nodemailer = require('nodemailer'); 

require("./auth")
const app = express();
app.use(express.json());
const passport = require("passport")
var session = require('express-session');
const { main , sendMailResponese } = require("./emailSend");
const jwt = require("jsonwebtoken")
const cors = require('cors');
const { isLogin } = require("./Middleware/isLogin");
const {google} = require("googleapis");
const { getEmails } = require("./captureEmails");

// const { sendMails } = require("./emailSend");
require("dotenv").config();
app.use(cors())
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/google',
passport.authenticate('google', 
{ scope: 
    ['email', 'profile',
     'https://www.googleapis.com/auth/gmail.readonly',
     'https://www.googleapis.com/auth/gmail.compose',
     'https://www.googleapis.com/auth/gmail.modify'
    ] 
})
);

// here we are checking authenticated or not
app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success', // Redirect to this route upon successful authentication
        failureRedirect: '/auth/google/failure'  // Redirect to this route upon failed authentication
    }),
);

app.get("/auth/google/failure",(req,res)=>{
    res.send("Something went wrong!")
})

app.get("/auth/google/success", isLogin, async(req, res) => {
    
    const html = `
        <h4>Thank you so much for connecting us</h4>
        <h4>Reachinbox is Razorsharp E-mail Outreach tool powered by AI</h4>
        <p>Are you interested in our service</p>
        <a href="http://localhost:3000/interest">click</a> 
    `;

    const details = {
        from: process.env.GMAIL_USER,
        to: req.user.email,
        subject: 'Reachinbox',
        text: 'Thank you so much for interest in Reachinbox',
        html: html
    };
     // Get access token from the user's session
     const accessToken = req.user.tokens.access_token;

     // Set access token for OAuth client
     const oauth2Client = new google.auth.OAuth2();
     oauth2Client.setCredentials({ access_token: accessToken });

     // find users emails
     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

     // Fetch the list of messages
     const messages = await gmail.users.messages.list({ userId: 'me' });

     // Fetch the content of the first message
    getEmails(gmail,messages)

    main(details);
    // console.log(req.user)
    let user = req.user;
    let token = jwt.sign({ email: user.email, name: user.given_name }, 'secrete');
    res.redirect(`${process.env.CALL_FRONTEND_URL}?token=${token}`);
});



// get route for welcome note
app.get("/",async(req,res)=>{
    try{
        res.status(200).send("Welcome to Razorsharp E-mail Outreach tool powered by AI")
    }catch(err){
        res.status(500).send({"error":err})
    }
})

app.post("/user/interest",async(req,res)=>{
    console.log(req.body,"body")
    try{
        sendMailResponese(req.body.email,req.body.interest)
        res.status(201).send("Thank you so much for interest")
    }catch(err){
        res.status(500).send({"error":err})
    }
})

app.listen(process.env.PORT, async()=>{
    try{
        await connection
        console.log("Server is running")
    }catch(err){
        console.log(err)
    }
})