import { Album, AlbumsDataSet } from "../../types";
import fetch from "isomorphic-unfetch";
import { baseUrl } from "../../utilities/base-url/base-url";
import {
  setLastSavedAlbumId,
  setSavedAlbums,
  getLastSavedAlbumId
} from "../../utilities/localstorage";
import { toDataSet } from "../../utilities/album-utils/album-utils";

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
