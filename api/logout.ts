import { Request, Response } from "express";
import { app } from "../utilities/app";

app.get("*", async (req: Request, res: Response) => {
  req.session && delete req.session["nostalgiafy-spotify-user"];
  res.status(200).redirect("/");
});

export default app;
