const express = require("express");
const { connection } = require("./db");

// for sending emails
const nodemailer = require('nodemailer'); 

require("./auth")
const app = express();
app.use(express.json());
const passport = require("passport")
var session = require('express-session');

const { sendMail } = require("./emailSend");
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
      [ 'email','profile' ] } // we wil getting only email,proile information only form google not every information
));

// here we are checking authenticated or not
app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success', // Redirect to this route upon successful authentication
        failureRedirect: '/auth/google/failure'  // Redirect to this route upon failed authentication
    }),
);

    // function (req, res) {
    // // Successful authentication, redirect home.
    // let user = req.user;
    // // console.log(user)
   
    // res.redirect(`http://localhost:3000`);
//   }
//  );


app.get("/auth/google/failure",(req,res)=>{
    res.send("Something went wrong!")
})



// create mailTransporter using createTransport methode and pass gmail id and app password for authentication

const mailTransporter =
	nodemailer.createTransport(
		{
			service: 'gmail',
            host:'smtp.gmail.com',
            port:587,
            secure:false,
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_APP_PASSWORD
			}
		}
	);


app.get("/auth/google/success", isLoggedIn, (req,res)=>{
    console.log(req.user)
    // let name = req.user.displayName;

    // creating the receivers details and passing the mail details
    const mailDetails = {
        from:{
            name:"reachinbox-assignment",
            address:process.env.GMAIL_USER
        },
        to:'jahirpp123@gmail.com',
        subject: 'Thank you so much for interest in Reachinbox',
        text: 'This Reachinbox Autometed mail',
        // html:"<b>This Reachinbox Autometed mail</b>"
    };
    sendMail(mailTransporter,mailDetails)

    res.send(`Hello ${req.user.name.givenName}`)
})


// get route for welcome note
app.get("/",async(req,res)=>{
    try{
        res.status(200).send("Welcome to Razorsharp E-mail Outreach tool powered by AI")
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