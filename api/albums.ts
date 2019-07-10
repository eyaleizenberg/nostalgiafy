import { app } from "../utilities/app";
import { Request, Response } from "express";
import { checkLogin } from "../utilities/check-login";
import { findUserById } from "../utilities/db";
import SpotifyWebApi from "spotify-web-api-node";

app.get("*", async (req: Request, res: Response) => {
  await checkLogin({ req, res } as any);
  // @ts-ignore
  const id = req.session["nostalgiafy-spotify-user"]._id;
  const { accessToken, refreshToken } = await findUserById(id);
  const spotifyApi = new SpotifyWebApi({
    accessToken,
    refreshToken,
    clientId: process.env.SPOTIFY_TOKEN,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: "http://localhost:3000/api/login"
  });

  let albums;

  try {
    albums = await spotifyApi.getMySavedAlbums({
      limit: 50,
      offset: 0
    });
  } catch ({ statusCode }) {
    if (statusCode === 401) {
      const data = await spotifyApi.refreshAccessToken();
      console.log("!!!!!!!!!1", data);
      const newToken = data.body["access_token"];
      spotifyApi.setAccessToken(newToken);
    }
    albums = await spotifyApi.getMySavedAlbums({
      limit: 50,
      offset: 0
    });
  }
  res.setHeader("Content-Type", "application/json");
  res.status(200).end(JSON.stringify(albums.body.items));
});

export default app;
