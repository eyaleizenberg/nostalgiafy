import Chance from "chance";
import {
  AlbumRawWithDate,
  Album,
  AlbumRaw,
  ReleaseDatePrecision
} from "./../../types";

const chance = new Chance();

export const generateReleaseDate = (): string => {
  const year = chance.year({ min: 1900, max: 2019 });
  const month = chance
    .natural({ min: 1, max: 12 })
    .toString()
    .padStart(2, "0");

  const day = chance
    .natural({ min: 1, max: 31 })
    .toString()
    .padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const generateRawAlbumWithDate = (
  opts: Partial<AlbumRaw> = {}
): AlbumRawWithDate => ({
  added_at: chance.date().toString(),
  album: generateRawAlbum(opts)
});

export const generateRawAlbum = (opts: Partial<AlbumRaw> = {}): AlbumRaw => ({
  artists: opts.artists || [
    {
      name: chance.name(),
      id: chance.hash({ length: 22 })
    }
  ],
  images: opts.images || [
    {
      url: chance.url()
    }
  ],
  id: opts.id || chance.hash({ length: 22 }),
  name: opts.name || chance.name(),
  release_date: opts.release_date || generateReleaseDate(),
  release_date_precision:
    opts.release_date_precision ||
    chance.pickone([
      ReleaseDatePrecision.DAY,
      ReleaseDatePrecision.MONTH,
      ReleaseDatePrecision.YEAR
    ])
});

export const generateAlbum = (opts: Partial<Album> = {}): Album => ({
  name: opts.name || chance.sentence({ words: 3 }),
  artist: opts.artist || chance.name(),
  releaseDate: opts.releaseDate || generateReleaseDate(),
  id: opts.id || chance.hash({ length: 22 }),
  artistId: opts.artistId || chance.hash({ length: 22 }),
  imageUrl: opts.imageUrl || chance.url()
});
