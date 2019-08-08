import { AlbumRaw } from "./album";
export interface AlbumsDataSet {}
export enum ReleaseDatePrecision {
  DAY = "day",
  MONTH = "month",
  YEAR = "year"
}

export interface Album {
  name: string;
  artist: string;
  releaseDate: Date;
  id: string;
  artistId: string;
  imageUrl: string;
}

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
}

export interface AlbumRawWithDate {
  added_at: string;
  album: AlbumRaw;
}

export interface AlbumsDataSet {
  [id: string]: Album;
}
