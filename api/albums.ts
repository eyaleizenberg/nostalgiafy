import { app } from "../utilities/app";
import { Request, Response } from "express";
import { checkLogin } from "../utilities/check-login";
import { findUserById, updateUser } from "../db/user";
import {
  getAlbumsFromSpotify,
  getNewAccessToken
} from "../utilities/spotify-api";

app.get("*", async (req: Request, res: Response) => {
  await checkLogin({ req, res } as any);
  // @ts-ignore
  const id = req.session["nostalgiafy-spotify-user"]._id;
  const { accessToken, refreshToken } = await findUserById(id);
  let albums;

  try {
    albums = await getAlbumsFromSpotify({ accessToken, refreshToken });
  } catch ({ statusCode }) {
    if (statusCode === 401) {
      const newToken = await getNewAccessToken({ accessToken, refreshToken });
      await updateUser({ _id: id, accessToken: newToken });
      albums = await getAlbumsFromSpotify({
        accessToken: newToken,
        refreshToken
      });
    }
  }
  res.setHeader("Content-Type", "application/json");
  res.status(200).end(JSON.stringify(albums));
});

export default app;
