import { AlbumsDataSet } from "../../types";
import {
  setLastSavedAlbumId,
  setSavedAlbums,
  getLastSavedAlbumId
} from "../localstorage";
import { toDataSet } from "../album-utils/album-utils";
import { fetchAlbums } from "../../services/albums-service/albums-service";

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
