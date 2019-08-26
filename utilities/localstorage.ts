import { AlbumsDataSet } from "./../types";

const albumsKey = "nostalgiafy-albums-data";

const lastSavedAlbumKey = "nostalgiafy-last-save-album";

export const setSavedAlbums = (data: AlbumsDataSet): void => {
  localStorage.setItem(albumsKey, JSON.stringify(data));
};

export const getSavedAlbums = (): AlbumsDataSet => {
  const unparsedData = localStorage.getItem(albumsKey);
  return unparsedData
    ? JSON.parse(unparsedData)
    : {
        byDate: {},
        albumsInfo: {}
      };
};

export const setLastSavedAlbumId = (id: string): void => {
  localStorage.setItem(lastSavedAlbumKey, id);
};

export const getLastSavedAlbumId = (): string | null =>
  localStorage.getItem(lastSavedAlbumKey);
