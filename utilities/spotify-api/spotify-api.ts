import {
  Tokens,
  AlbumRawWithDate,
  TokensAndSavedId,
  SpotifyResponse,
  SpotifyClient
} from "../../types";
import SpotifyWebApi from "spotify-web-api-node";
import { baseUrl } from "../base-url/base-url";
import { Artist } from "../../types/artists";

const limit = 50;

export const getClient = ({ accessToken, refreshToken }: Tokens) =>
  new SpotifyWebApi({
    accessToken,
    refreshToken,
    clientId: process.env.SPOTIFY_TOKEN,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: `${baseUrl}/api/login`
  });

export const getArtists = async ({
  tokens,
  artistIds
}: {
  tokens: Tokens;
  artistIds: string[];
}): Promise<Artist[]> => {
  const client = getClient(tokens);
  const artists = (await client.getArtists(artistIds)).body.artists;
  return artists;
};

export const getAlbumsFromSpotify = async ({
  lastSavedAlbumId,
  tokens
}: TokensAndSavedId): Promise<AlbumRawWithDate[]> => {
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
  if (!lastSavedAlbumId) {
    return [];
  }

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
  const {
    body: { next, items }
  }: SpotifyResponse = await spotifyApi.getMySavedAlbums({
    limit,
    offset
  });

  const lastSavedAlbumIdIndex = items.findIndex(
    ({ album }: AlbumRawWithDate) => album.id === lastSavedAlbumId
  );

  if (lastSavedAlbumIdIndex > -1) {
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

export const getTopArtists = async (tokens: Tokens): Promise<Artist[]> => {
  const spotifyApi = getClient(tokens);
  const response = await spotifyApi.getMyTopArtists({
    time_range: "long_term",
    limit: 50
  });

  return response.body.items;
};
