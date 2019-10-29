import { Request, Response } from "express";
import passport from "passport";
import { Strategy } from "passport-spotify";
import { app } from "../utilities/app";
import { ProfileWithRaw } from "../types";
import { findOrCreateUserFromSpotify } from "../db/user";
import { baseUrl } from "../utilities/base-url/base-url";
import { setFavoriteGenres } from "../db/favorite-genres/favorite-genres";

app.use(passport.initialize());
app.use(passport.session());

const getUser = async (
  accessToken: string,
  refreshToken: string,
  profile: ProfileWithRaw,
  cb: Function
) => {
  const { _raw, _json, ...profileProps } = profile;
  const user = await findOrCreateUserFromSpotify({
    ...profileProps,
    accessToken,
    refreshToken
  });

  cb(null, user);
};

passport.use(
  new Strategy(
    {
      clientID: process.env.SPOTIFY_TOKEN,
      clientSecret: process.env.SPOTIFY_SECRET,
      callbackURL: `${baseUrl}/api/login`
    },
    getUser
  )
);

passport.serializeUser(function(profile: ProfileWithRaw, done) {
  done(null, profile);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get(
  "*",
  passport.authenticate("spotify", {
    scope: ["user-library-read", "user-top-read"],
    failureRedirect: "/"
  } as any),
  async (req: Request, res: Response) => {
    if (req.session) {
      delete req.session.passport; // This adds a lot of bloat to the cookie and causes it to not get persisted.
    } else {
      req.session = {};
    }

    const {
      _id,
      displayName,
      photos,
      accessToken,
      refreshToken,
      id
    } = req.user;

    await setFavoriteGenres({
      accessToken,
      refreshToken,
      spotifyId: id,
      userId: _id
    });

    req.session["nostalgiafy-spotify-user"] = {
      _id,
      displayName,
      profilePic: photos[0]
    };

    res.redirect("/albums");
  }
);

export default app;
