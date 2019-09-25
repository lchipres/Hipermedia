const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

//import schema
const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, donde) => {
    User.findById(id)
    .then(user => {
        donde(null, user);
    });
})

//passport will use google's login (u could add more)
passport.use(new GoogleStrategy(
    {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({googleId: profile.id})
            .then((existingUser) => {
                if(existingUser) {
                    done(null, existingUser)
                } else {
                    console.log(profile);
                    new User({ googleId: profile.id }).save()
                    .then(user => done(null, user))
                }
            });
        }
    )
);