import { app } from "../utilities/app";
import { Request, Response } from "express";
import { checkLogin } from "../utilities/check-login";
import { setAlbums, fetchAlbums } from "../db/albums-db/albums-db";
import { fetchFavoriteGenres } from "../db/favorite-genres/favorite-genres";
import { getArtists } from "../utilities/spotify-api/spotify-api";
import { findUserById } from "../services/user/user";
import { Album } from "../types";

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
  // @ts-ignore
  const userId = req.session["nostalgiafy-spotify-user"]._id;
  const { accessToken, refreshToken } = await findUserById(userId);
  const { releaseDateKey } = req.query;

  if (!releaseDateKey) {
    res.status(500).end("missing releaseDateKey");
  }

  const [albums, favoriteGenres] = await Promise.all([
    fetchAlbums(releaseDateKey).then(async allAlbums => {
      const artists = await getArtists({
        tokens: { accessToken, refreshToken },
        artistIds: allAlbums.map(({ artistId }) => artistId)
      });

      const artistsGenres: Record<string, string[]> = artists.reduce(
        (res, artist) => ({ ...res, [artist.id]: artist.genres }),
        {}
      );

      return allAlbums.map(album => ({
        ...album,
        genres: artistsGenres[album.artistId]
      }));
    }),
    fetchFavoriteGenres(userId)
  ]);

  let relevantAlbums: Album[] = [];

  if (favoriteGenres) {
    relevantAlbums = albums.filter(album =>
      album.genres.some(genre => genre in favoriteGenres)
    );
  }

  res.status(200).end(JSON.stringify(relevantAlbums));
});

export default app;
