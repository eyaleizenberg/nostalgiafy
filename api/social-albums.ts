import { app } from "../utilities/app";
import { Request, Response } from "express";
import { checkLogin } from "../utilities/check-login";
import { setAlbums } from "../db/albums-db/albums-db";

app.post("*", async (req: Request, res: Response) => {
  await checkLogin({ req, res } as any);
  // TODO: SANITIZE!!!!!
  try {
    await setAlbums(req.body.albums);
  } catch (error) {
    console.log("&&&&&&&&", error);
    res.status(500).end();
  }

  res.status(200).end();
});

export default app;
