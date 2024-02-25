const passport = require("passport");
const { UserEmailModel } = require("./modal/gmail.modal");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

require("dotenv").config();


passport.use(
    new GoogleStrategy({
       clientID:process.env.GOOGLE_CLIENT_ID,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       callbackURL: process.env.REDIRECT_URI,
       passReqToCallback   : true
    },

    async function(request, accessToken, refreshToken, profile, done) {
      done(null,profile)
      let email = profile["_json"].email;

      let isUserExist = await UserEmailModel.find({email});

      if(isUserExist.length)
      {
         await UserEmailModel.findOneAndUpdate(
         { email: email },
         {
            createAt: Number(Date.now()),
            expireAt: Number(Date.now()) + 1000 * 60 * 30,
         }
         );
         return done(null, isUserExist[0]);
      }
      else{
         // console.log(profile["_json"])
         let user = new UserEmailModel({
            email: email,
            name: profile["_json"].name,
            picture:profile["_json"].picture,
            createAt: Number(Date.now()),
            expireAt: Number(Date.now()) + 1000 * 60 * 30,
         });
         await user.save();
         return done(null, profile);
      }
   }
));
passport.serializeUser((user,done)=>done(null,user));

passport.deserializeUser((user,done)=> done(null,user))