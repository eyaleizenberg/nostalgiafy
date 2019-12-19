import fetch from "isomorphic-unfetch";
import { baseUrl } from "../../utilities/base-url/base-url";
import { Album } from "../../types";
import { releaseDateKey } from "../../utilities/album-utils/album-utils";

export const socialAlbumsUrl = `${baseUrl}/api/social-albums`;

export const setSocialAlbums = (albums: Album[]): Promise<Response> => {
  const albumsWithReleaseDateKey = albums.map(album => ({
    ...album,
    releaseDateKey: releaseDateKey(album.releaseDate)
  }));
  return fetch(socialAlbumsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ albums: albumsWithReleaseDateKey })
  });
};

export const fetchSocialAlbums = () => {};
