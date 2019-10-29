export interface Artist {
  id: string;
  genres: string[];
}

export interface Genres {
  [genre: string]: boolean;
}
