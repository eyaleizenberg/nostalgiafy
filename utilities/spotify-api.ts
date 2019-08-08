import { AlbumRawWithDate } from "./../types/album";
import { Tokens } from "./../types";
import SpotifyWebApi from "spotify-web-api-node";

const limit = 50;

const getClient = ({ accessToken, refreshToken }: Tokens) =>
  new SpotifyWebApi({
    accessToken,
    refreshToken,
    clientId: process.env.SPOTIFY_TOKEN,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: "http://localhost:3000/api/login"
  });

export const getAlbumsFromSpotify = async (
  tokens: Tokens
): Promise<AlbumRawWithDate[]> => {
  const spotifyApi = getClient(tokens);

  let albums: AlbumRawWithDate[] = [];

  const {
    body: { next, items, total }
  } = await spotifyApi.getMySavedAlbums({
    limit,
    offset: 0
  });

  albums.push(items);

  if (next) {
    const iterationsNeeded = Math.ceil((total - limit) / limit);
    const responses = await Promise.all(
      Array.from(Array(iterationsNeeded)).map((_val, index) => {
        return spotifyApi.getMySavedAlbums({ limit, offset: 50 + index * 50 });
      })
    );

    responses.forEach(response => {
      albums.push(response.body.items);
    });
  }

  return albums.flat();
};

export const getNewAccessToken = async (tokens: Tokens): Promise<string> => {
  const spotifyApi = getClient(tokens);
  const data = await spotifyApi.refreshAccessToken();
  return data.body["access_token"];
};
