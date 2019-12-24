import { AlbumRaw } from "./album";

export enum ReleaseDatePrecision {
  DAY = "day",
  MONTH = "month",
  YEAR = "year"
}

export type Album = {
  name: string;
  artist: string;
  releaseDate: string;
  id: string;
  artistId: string;
  imageUrl: string;
  genres: string[];
};

export interface AlbumRaw {
  artists: {
    name: string;
    id: string;
  }[];
  images: {
    url: string;
  }[];
  id: string;
  name: string;
  release_date: string;
  release_date_precision: ReleaseDatePrecision;
  genres: string[];
}

export interface AlbumRawWithDate {
  added_at: string;
  album: AlbumRaw;
}

export interface DateToAlbumIds {
  [date: string]: {
    [albumId: string]: boolean;
  };
}

export interface IdToAlbum {
  [albumId: string]: Album;
}

export interface AlbumsDataSet {
  byDate: DateToAlbumIds;
  albumsInfo: IdToAlbum;
}
