import { Album } from "../../types";
import { generateAlbum } from "../../test/builders/album-builder";

const mockAlbum1 = generateAlbum({
  releaseDate: "1983-12-18"
});

const mockAlbum2 = generateAlbum({
  releaseDate: "1986-03-10"
});

const mockAlbum3 = generateAlbum({
  releaseDate: "1996-10-20"
});

const mockAlbums: Album[] = [mockAlbum1, mockAlbum2];
const lastSavedAlbumId = "123";
const mockSavedAlbumId = 123;
const mockSetLastSavedAlbumId = jest.fn();
const mockSetSavedAlbums = jest.fn();
const mockGetLastSavedAlbumId = jest.fn();
const mockJsonResponse = jest.fn();

jest.mock("isomorphic-unfetch", () => ({
  __esModule: true,
  default: jest.fn(() =>
    Promise.resolve({
      json: mockJsonResponse
    })
  )
}));

jest.mock("../../utilities/localstorage", () => ({
  setLastSavedAlbumId: mockSetLastSavedAlbumId,
  setSavedAlbums: mockSetSavedAlbums,
  getLastSavedAlbumId: mockGetLastSavedAlbumId
}));

import fetch from "isomorphic-unfetch";
import {
  fetchUserAlbums,
  generateFetchUserAlbumsUrl,
  getUserAlbums
} from "./user-albums";
import { baseUrl } from "../../utilities/base-url/base-url";
import { toDataSet } from "../../utilities/album-utils/album-utils";

const emptySavedData = toDataSet([]);

describe("api", () => {
  beforeEach(() => {
    mockJsonResponse.mockResolvedValueOnce(mockAlbums);
  });

  it("should generate url from the lastSavedAlbumId", () => {
    expect(generateFetchUserAlbumsUrl(lastSavedAlbumId)).toBe(
      `${baseUrl}/api/user-albums?lastSavedAlbumId=123`
    );
  });

  it("should fetch with the url", async () => {
    await fetchUserAlbums(lastSavedAlbumId);
    expect(fetch).toHaveBeenCalledWith(generateFetchUserAlbumsUrl("123"));
  });

  it("should return the albums from the request", async () => {
    expect(await fetchUserAlbums(lastSavedAlbumId)).toBe(mockAlbums);
  });

  describe("getAlbums", () => {
    describe("with saved albums", () => {
      beforeEach(() => {
        mockGetLastSavedAlbumId.mockReturnValueOnce(mockSavedAlbumId);
      });

      it("should return the merged albums", async () => {
        expect(await getUserAlbums(toDataSet([mockAlbum3]))).toEqual(
          toDataSet([mockAlbum1, mockAlbum2, mockAlbum3])
        );
      });

      it("should set the last savedAlbumId", async () => {
        await getUserAlbums(emptySavedData);
        expect(mockSetLastSavedAlbumId).toHaveBeenCalledWith(mockAlbum1.id);
      });

      it("should set the saved albums", async () => {
        await getUserAlbums(toDataSet([mockAlbum3]));
        expect(mockSetSavedAlbums).toHaveBeenCalledWith(
          toDataSet([mockAlbum1, mockAlbum2, mockAlbum3])
        );
      });
    });

    describe("without new saved albums", () => {
      it("should return the original saved data", async () => {
        mockJsonResponse.mockReset();
        mockJsonResponse.mockResolvedValueOnce([]);
        expect(await getUserAlbums(emptySavedData)).toEqual(emptySavedData);
      });
    });
  });
});
