jest.mock("isomorphic-unfetch", () => ({
  __esModule: true,
  default: jest.fn(() =>
    Promise.resolve({
      json: {}
    })
  )
}));

import fetch from "isomorphic-unfetch";
import { generateAlbum } from "../../test/builders/album-builder";
import { setSocialAlbums, socialAlbumsUrl } from "./social-albums";
import { releaseDateKey } from "../../utilities/album-utils/album-utils";

const albums = [generateAlbum()];

describe("social-albums", () => {
  it("should send the albums to the server", async () => {
    await setSocialAlbums(albums);
    const albumsWithReleaseDateKey = albums.map(album => ({
      ...album,
      releaseDateKey: releaseDateKey(album.releaseDate)
    }));
    expect(fetch).toHaveBeenCalledWith(socialAlbumsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ albums: albumsWithReleaseDateKey })
    });
  });
});
