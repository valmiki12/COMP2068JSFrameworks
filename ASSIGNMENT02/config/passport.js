const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
require('dotenv').config();


module.exports = (passport) => {
  // Local Strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: 'Invalid username or password' });
        }
        if (user.password !== password) {
          return done(null, false, { message: 'Invalid username or password' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // GitHub Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback', // Fallback for local development
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if the user exists by GitHub ID
          let user = await User.findOne({ githubId: profile.id });
          if (!user) {
            // Create a new user if one does not exist
            user = await User.create({
              githubId: profile.id,
              username: profile.username,
              email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
            });
          }
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  // Serialize and Deserialize Users
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
