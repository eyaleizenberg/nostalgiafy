import { Tokens, Album } from "./../types";
import SpotifyWebApi from "spotify-web-api-node";

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
): Promise<Album[]> => {
  const spotifyApi = getClient(tokens);

  const albums = await spotifyApi.getMySavedAlbums({
    limit: 50,
    offset: 0
  });

  return albums.body.items;
};

export const getNewAccessToken = async (tokens: Tokens): Promise<string> => {
  const spotifyApi = getClient(tokens);
  const data = await spotifyApi.refreshAccessToken();
  return data.body["access_token"];
};
