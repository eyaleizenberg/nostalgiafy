import { app } from "../utilities/app";
import { Request, Response } from "express";
import { checkLogin } from "../utilities/check-login";
import { setAlbums, fetchAlbums } from "../db/albums-db/albums-db";

app.post("*", async (req: Request, res: Response) => {
  await checkLogin({ req, res } as any);
  // TODO: SANITIZE!!!!!
  try {
    await setAlbums(req.body.albums);
    res.status(200).end();
  } catch {
    res.status(200).end();
  }
});

app.get("*", async (req: Request, res: Response) => {
  await checkLogin({ req, res } as any);
  const { releaseDateKey } = req.query;

  if (!releaseDateKey) {
    res.status(500).end("missing releaseDateKey");
  }

  const albums = await fetchAlbums(releaseDateKey);
  res.status(200).end(JSON.stringify(albums));
});

export default app;
