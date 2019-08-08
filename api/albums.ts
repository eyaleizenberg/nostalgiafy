import { AlbumRawWithDate } from "./../types/album";
import { app } from "../utilities/app";
import { Request, Response } from "express";
import { checkLogin } from "../utilities/check-login";
import { findUserById, updateUser } from "../db/user";
import {
  getAlbumsFromSpotify,
  getNewAccessToken
} from "../utilities/spotify-api";
import { normalizeAlbums } from "../utilities/album-utils";

app.get("*", async (req: Request, res: Response) => {
  await checkLogin({ req, res } as any);
  // @ts-ignore
  const id = req.session["nostalgiafy-spotify-user"]._id;
  const { accessToken, refreshToken } = await findUserById(id);
  let rawAlbums: AlbumRawWithDate[] = [];

  try {
    rawAlbums = await getAlbumsFromSpotify({ accessToken, refreshToken });
  } catch ({ statusCode }) {
    if (statusCode === 401) {
      const newToken = await getNewAccessToken({ accessToken, refreshToken });
      // @ts-ignore
      const [_user, spotifyResponse] = await Promise.all([
        updateUser(id, { accessToken: newToken }),
        getAlbumsFromSpotify({
          accessToken: newToken,
          refreshToken
        })
      ]);

      rawAlbums = spotifyResponse;
    }
  }
  res.setHeader("Content-Type", "application/json");
  const normalizedAlbums = normalizeAlbums(rawAlbums);
  res.status(200).end(JSON.stringify(normalizedAlbums));
});

export default app;
