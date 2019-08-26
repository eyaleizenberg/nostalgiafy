import { Album } from "./../../types";
import fetch from "isomorphic-unfetch";

export const generateUrl = (lastSavedAlbumId: string | null): string =>
  `http://localhost:3000/api/albums?lastSavedAlbumId=${lastSavedAlbumId}`;

export const fetchAlbums = async (
  lastSavedAlbumId: string | null
): Promise<Album[]> => {
  const response = await fetch(generateUrl(lastSavedAlbumId));
  const albums = await response.json();
  return albums;
};
