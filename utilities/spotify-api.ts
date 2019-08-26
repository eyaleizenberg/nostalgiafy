import {
  Tokens,
  AlbumRawWithDate,
  TokensAndSavedId,
  SpotifyResponse,
  SpotifyClient
} from "./../types";
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

export const getAlbumsFromSpotify = async ({
  lastSavedAlbumId,
  tokens
}: TokensAndSavedId): Promise<AlbumRawWithDate[]> => {
  console.log("!!!!!!!!!1", lastSavedAlbumId);
  if (lastSavedAlbumId) {
    const albums = await getAlbumsDelta({ lastSavedAlbumId, tokens });
    return albums;
  } else {
    const albums = await getAllAlbums(tokens);
    return albums;
  }
};

export const getAlbumsDelta = async ({
  tokens,
  lastSavedAlbumId
}: TokensAndSavedId): Promise<AlbumRawWithDate[]> => {
  return findDelta({
    lastSavedAlbumId,
    spotifyApi: getClient(tokens)
  });
};

export const findDelta = async ({
  lastSavedAlbumId,
  spotifyApi,
  offset = 0,
  albums = []
}: {
  lastSavedAlbumId: string;
  spotifyApi: SpotifyClient;
  offset?: number;
  albums?: AlbumRawWithDate[];
}): Promise<AlbumRawWithDate[]> => {
  console.log("FINDING DELTA!", offset);
  const {
    body: { next, items }
  }: SpotifyResponse = await spotifyApi.getMySavedAlbums({
    limit,
    offset
  });

  const lastSavedAlbumIdIndex = items.findIndex(
    ({ album }: AlbumRawWithDate) => album.id === lastSavedAlbumId
  );

  if (lastSavedAlbumIdIndex) {
    albums.push(...items.slice(0, lastSavedAlbumIdIndex));
    return albums;
  } else if (next) {
    albums.push(...items);
    findDelta({
      lastSavedAlbumId,
      spotifyApi,
      offset: offset + 50,
      albums
    });
  }

  return albums;
};

export const getAllAlbums = async (
  tokens: Tokens
): Promise<AlbumRawWithDate[]> => {
  let albums: AlbumRawWithDate[] = [];
  const spotifyApi = getClient(tokens);

  const {
    body: { total, next, items }
  } = await spotifyApi.getMySavedAlbums({
    limit,
    offset: 0
  });

  albums.push(...items);

  if (next) {
    const iterationsNeeded = Math.ceil((total - limit) / limit);
    const responses = await Promise.all(
      Array.from(Array(iterationsNeeded)).map((_val, index) => {
        console.log("!!!!!!!!!! REQUEST", index);
        return spotifyApi.getMySavedAlbums({ limit, offset: 50 + index * 50 });
      })
    );

    responses.forEach(response => {
      albums.push(...response.body.items);
    });
  }

  return albums;
};

export const getNewAccessToken = async (tokens: Tokens): Promise<string> => {
  const spotifyApi = getClient(tokens);
  const data = await spotifyApi.refreshAccessToken();
  return data.body["access_token"];
};
