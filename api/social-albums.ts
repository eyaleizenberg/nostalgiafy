import { app } from "../utilities/app";
import { Request, Response } from "express";
import { checkLogin } from "../utilities/check-login";
import { setAlbums, fetchAlbums } from "../db/albums-db/albums-db";
import { fetchFavoriteGenres } from "../db/favorite-genres/favorite-genres";
import {
  getArtists,
  getNewAccessToken
} from "../utilities/spotify-api/spotify-api";
import { findUserById, updateUser } from "../services/user/user";
import { Album, Artist } from "../types";

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

const getAlbumArtists = async (
  userId: string,
  allAlbums: Album[]
): Promise<Artist[]> => {
  const { accessToken, refreshToken } = await findUserById(userId);

  let artists: Artist[];

  try {
    artists = await getArtists({
      tokens: { accessToken, refreshToken },
      artistIds: allAlbums.map(({ artistId }) => artistId)
    });
  } catch (error) {
    if (error.statusCode === 401) {
      const newToken = await getNewAccessToken({ accessToken, refreshToken });
      // @ts-ignore
      const [_user, spotifyResponse] = await Promise.all([
        updateUser(userId, { accessToken: newToken }),
        getArtists({
          tokens: { accessToken: newToken, refreshToken },
          artistIds: allAlbums.map(({ artistId }) => artistId)
        })
      ]);

      artists = spotifyResponse;
    } else {
      artists = [];
    }
  }

  return artists;
};

app.get("*", async (req: Request, res: Response) => {
  await checkLogin({ req, res } as any);
  // @ts-ignore
  const userId = req.session["nostalgiafy-spotify-user"]._id;
  const { releaseDateKey } = req.query;

  if (!releaseDateKey) {
    res.status(500).end("missing releaseDateKey");
  }

  const [albums, favoriteGenres] = await Promise.all([
    fetchAlbums(releaseDateKey).then(async allAlbums => {
      const artists = await getAlbumArtists(userId, allAlbums);

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
