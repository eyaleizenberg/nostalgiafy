import { Request, Response } from "express";
import passport from "passport";
import { Strategy } from "passport-spotify";
import { app } from "../utilities/app";

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new Strategy(
    {
      clientID: process.env.SPOTIFY_TOKEN,
      clientSecret: process.env.SPOTIFY_SECRET,
      callbackURL: "http://localhost:3000/api/login"
    },
    function(_token: string, _tokenSecret: string, profile: any, cb: Function) {
      console.log('TOKEN ', _token, "TOKEN SECRET ", _tokenSecret);
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get(
  "*",
  passport.authenticate("spotify", {
    scope: ['user-library-read'],
    showDialog: true
  } as any),
  (req: Request, res: Response) => {
    if (req.session) {
      delete req.session.passport; // This adds a lot of bloat to the cookie and causes it to not get persisted.
    } else {
      req.session = {};
    }

    const {
      id,
      displayName,
    } = req.user;

    req.session["nostalgiafy-spotify-user"] = {
      id,
      displayName,
    };

    res.redirect("/albums");
  }
);

module.exports = app;
