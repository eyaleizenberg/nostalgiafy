import { Album } from "../../types";
import { fetchAlbums, generateUrl } from "./albums-service";
import fetch from "isomorphic-unfetch";
import { baseUrl } from "../../utilities/base-url/base-url";

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
      `${baseUrl}/api/albums?lastSavedAlbumId=123`
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
