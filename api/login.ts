// app.get('*', (req: Request, res: Response) => {
//   console.log('Hello KUKU!', req.url)
//   res.set('Content-Type', 'text/html');
//   res.status(200).end('KUKU 098');
// });

// module.exports = app;

import { Request, Response } from "express";
import passport from "passport";
import { Strategy } from "passport-spotify";
import { app } from "../utilities/app";

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new Strategy(
    {
      consumerKey: process.env.SPOTIFY_TOKEN,
      consumerSecret: process.env.SPOTIFY_SECRET,
      callbackURL: "http://localhost:3000/login"
    },
    function(_token: string, _tokenSecret: string, profile: any, cb: Function) {
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
  passport.authenticate("spotify"),
  (req: Request, res: Response) => {
    if (req.session) {
      delete req.session.passport; // This adds a lot of bloat to the cookie and causes it to not get persisted.

      const {
        name,
        description,
        screen_name,
        profile_image_url_https,
        profile_link_color
      } = req.user._json;

      req.session["user-from-twitter"] = {
        name,
        screen_name,
        description,
        profile_link_color,
        profile_image_url_https
      };
    }
    res.redirect("/albums");
  }
);

module.exports = app;
