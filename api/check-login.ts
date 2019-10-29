import { Request, Response } from "express";
import { app } from "../utilities/app";

app.get("*", (req: Request, res: Response) => {
  if (!req.session || !req.session["nostalgiafy-spotify-user"]) {
    res.status(403).end();
  } else {
    const { displayName, profilePic } = req.session["nostalgiafy-spotify-user"];
    res.status(200).json({ displayName, profilePic });
  }
});

export default app;
