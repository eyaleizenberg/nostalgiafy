import { Request, Response } from "express";
import { app } from "../utilities/app";

app.get("*", (req: Request, res: Response) => {
  if (!req.session || !req.session["nostalgiafy-spotify-user"]) {
    res.status(403).end();
  } else {
    res.set('Content-Type', 'text/html');
    res.status(200).end('LETS GET SOME ALBUMS');
  }
})

module.exports = app;