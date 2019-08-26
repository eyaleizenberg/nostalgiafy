import { Album } from "./../../types";
import { fetchAlbums, generateUrl } from "./api";
import fetch from "isomorphic-unfetch";

const mockAlbums: Album[] = [];
const lastSavedAlbumId = "123";

jest.mock("isomorphic-unfetch", () => ({
  __esModule: true,
  default: jest.fn(() =>
    Promise.resolve({
      json: () => mockAlbums
    })
  )
}));

describe("api", () => {
  it("should generate url from the lastSavedAlbumId", () => {
    expect(generateUrl(lastSavedAlbumId)).toBe(
      "http://localhost:3000/api/albums?lastSavedAlbumId=123"
    );
  });

  it("should fetch with the url", async () => {
    await fetchAlbums(lastSavedAlbumId);
    expect(fetch).toHaveBeenCalledWith(generateUrl("123"));
  });

  it("should return the albums from the request", async () => {
    expect(await fetchAlbums(lastSavedAlbumId)).toBe(mockAlbums);
  });
});
