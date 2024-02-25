const express = require("express");
const { connection } = require("./db");
require("./auth")
const app = express();
app.use(express.json());
const passport = require("passport")
var session = require('express-session')

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
        // successRedirect: 'http://localhost:3000', // if yes then redirect this route
        failureRedirect: '/auth/google/failure'// if no then redirect this route,
    
    }),

    function (req, res) {
    // Successful authentication, redirect home.
    let user = req.user;
    // console.log(user)
   
    res.redirect(`http://localhost:3000`);
  }
 );


app.get("/auth/google/failure",(req,res)=>{
    res.send("Something went wrong!")
})


app.get("/auth/google/success", isLoggedIn, (req,res)=>{
    console.log(req.user)
    let name = req.user.displayName;
    res.status(201).send(`Hello ${req.user.name.givenName}`)
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