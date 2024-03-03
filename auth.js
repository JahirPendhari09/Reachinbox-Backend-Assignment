

const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { google } = require('googleapis');

require("dotenv").config();

passport.use(new GoogleStrategy({
       clientID: process.env.GOOGLE_CLIENT_ID,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       callbackURL: process.env.REDIRECT_URI,
       passReqToCallback: true
    },
    // function to share data about user and some additional details
    function (request, accessToken, refreshToken, profile, done) {
      
        profile.tokens = { access_token: accessToken, refresh_token: refreshToken };

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });
        const userGmail = google.gmail({ version: 'v1', auth: oauth2Client });

        userGmail.users.getProfile({ userId: 'me' }, (err, res) => {
            if (err) {
                console.error('Error', err);
                return done(err);
            }

            // set profile gmails data as res.data
            profile.gmailProfile = res.data;
            done(null, profile);
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;
