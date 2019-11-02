import fetch from "isomorphic-unfetch";
import { baseUrl } from "../../utilities/base-url/base-url";
import { AlbumsDataSet, Album } from "../../types";
import {
  setLastSavedAlbumId,
  setSavedAlbums,
  getLastSavedAlbumId
} from "../../utilities/localstorage";
import {
  toDataSet,
  releaseDateKey
} from "../../utilities/album-utils/album-utils";
import { connectToAlbumsCollection } from "../../db/db-api";

export const setAlbums = async (albums: Album[]) => {
  const collection = await connectToAlbumsCollection();
  collection.insertMany(
    albums.map(album => ({
      _id: album.id,
      releaseDateKey: releaseDateKey(album.releaseDate)
    })),
    {
      ordered: false
    }
  );
};

export const getAlbums = async (
  savedAlbums: AlbumsDataSet
): Promise<AlbumsDataSet> => {
  const lastSavedAlbumId = getLastSavedAlbumId();
  const albums = await fetchAlbums(lastSavedAlbumId);

  if (albums && albums.length) {
    const albumsDataSet = toDataSet(albums, savedAlbums);
    setLastSavedAlbumId(albums[0].id);
    setSavedAlbums(albumsDataSet);
    return albumsDataSet;
  }

  return savedAlbums;
};

export const generateUrl = (lastSavedAlbumId: string | null): string => {
  let albumsUrl = `${baseUrl}/api/albums`;
  if (lastSavedAlbumId) {
    albumsUrl = albumsUrl + `?lastSavedAlbumId=${lastSavedAlbumId}`;
  }

  return albumsUrl;
};

export const fetchAlbums = async (
  lastSavedAlbumId: string | null
): Promise<Album[]> => {
  const response = await fetch(generateUrl(lastSavedAlbumId));
  const albums = await response.json();
  return albums;
};

