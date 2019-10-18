import {
  Album,
  AlbumRaw,
  AlbumRawWithDate,
  ReleaseDatePrecision,
  AlbumsDataSet
} from "../../types/album";

export const normalizeAlbum = ({
  name,
  artists,
  release_date,
  id,
  images
}: AlbumRaw): Album => ({
  name,
  artist: artists[0].name,
  releaseDate: release_date,
  id,
  artistId: artists[0].id,
  imageUrl: images[0].url
});

export const normalizeAndFilterAlbums = (
  rawData: AlbumRawWithDate[]
): Album[] =>
  rawData.reduce((res: Album[], { album }) => {
    if (album.release_date_precision === ReleaseDatePrecision.DAY) {
      return res.concat(normalizeAlbum(album));
    }
    return res;
  }, []);

export const releaseDateKey = (releaseDate: string): string =>
  releaseDate.replace(/[^-]*-/, "");

export const getTodaysAlbums = (
  { byDate, albumsInfo }: AlbumsDataSet,
  dateKey: string
): Album[] => {
  const todaysIds = byDate[dateKey];

  if (!todaysIds) {
    return [];
  }

  return Object.keys(todaysIds).map((albumId: string) => albumsInfo[albumId]);
};

export const toDataSet = (
  albums: Album[],
  initialData: AlbumsDataSet = {
    byDate: {},
    albumsInfo: {}
  }
): AlbumsDataSet =>
  albums.reduce((res: AlbumsDataSet, album: Album) => {
    const key = releaseDateKey(album.releaseDate);

    return {
      byDate: {
        ...res.byDate,
        [key]: {
          ...(res.byDate[key] || {}),
          [album.id]: true
        }
      },
      albumsInfo: {
        ...res.albumsInfo,
        [album.id]: album
      }
    };
  }, initialData);
