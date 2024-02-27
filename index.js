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
const { UserEmailModel } = require("./modal/gmail.modal");
const jwt = require("jsonwebtoken")

// const { sendMails } = require("./emailSend");
require("dotenv").config();

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(passport.initialize());
app.use(passport.session());


function isLoggedIn (req,res,next){
    return req.user ? next() : res.sendStatus(401)
}

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email','profile'] 
    } // we wil getting only email,proile information only form google not every information
));

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

app.get("/auth/google/success", isLoggedIn, (req, res) => {
    
    const html = `
        <h4>Thank you so much for connecting us</h4>
        <h4>Reachinbox is Razorsharp E-mail Outreach tool powered by AI</h4>
        <p>Are you interested in our service</p>
        <a href="http://localhost:3000/Interest">click</a>
        
    `;

    const details = {
        from: process.env.GMAIL_USER,
        to: req.user.email,
        subject: 'Reachinbox',
        text: 'Thank you so much for interest in Reachinbox',
        html: html
    };

    main(details);

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

app.post("/user/show-interest",async(req,res)=>{
    console.log(req.body,"body")
    try{
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