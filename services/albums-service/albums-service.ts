import { Album } from "../../types";
import fetch from "isomorphic-unfetch";
import { baseUrl } from "../../utilities/base-url/base-url";

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
