import { AlbumRawWithDate } from "./album";
import { Tokens } from "./user";

export interface TokensAndSavedId {
  lastSavedAlbumId: string;
  tokens: Tokens;
}

export interface SpotifyResponse {
  body: {
    items: AlbumRawWithDate[];
    total: number;
    next?: string;
  };
}

export interface SpotifyClient {
  getMySavedAlbums({
    limit,
    offset
  }: {
    limit: number;
    offset: number;
  }): Promise<SpotifyResponse>;
}
