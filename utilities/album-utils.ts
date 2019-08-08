import {
  Album,
  AlbumRaw,
  AlbumRawWithDate,
  AlbumsDataSet,
  ReleaseDatePrecision
} from "./../types/album";

export const normalizeAlbum = ({
  name,
  artists,
  release_date,
  id,
  images
}: AlbumRaw): Album => ({
  name,
  artist: artists[0].name,
  releaseDate: new Date(release_date),
  id,
  artistId: artists[0].id,
  imageUrl: images[0].url
});

export const normalizeAlbums = (rawData: AlbumRawWithDate[]): Album[] =>
  rawData.map(({ album }) => normalizeAlbum(album));

export const toDataSet = (rawData: AlbumRawWithDate[]): AlbumsDataSet =>
  rawData.reduce((res, { album }) => {
    if (album.release_date_precision === ReleaseDatePrecision.DAY) {
      return { ...res, [album.id]: normalizeAlbum(album) };
    }

    return res;
  }, {});
