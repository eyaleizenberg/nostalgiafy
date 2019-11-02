const mockSavedAlbumId = "123";
const mockSetLastSavedAlbumId = jest.fn();
const mockSetSavedAlbums = jest.fn();
const mockGetLastSavedAlbumId = jest.fn();
const mockAlbums: Album[] = [];
const mockResponse = jest.fn();

jest.mock("isomorphic-unfetch", () => ({
  __esModule: true,
  default: jest.fn(() =>
    Promise.resolve({
      json: mockResponse
    })
  )
}));

jest.mock("../../utilities/localstorage", () => ({
  setLastSavedAlbumId: mockSetLastSavedAlbumId,
  setSavedAlbums: mockSetSavedAlbums,
  getLastSavedAlbumId: mockGetLastSavedAlbumId
}));

const mockInsertMany = jest.fn();

jest.mock("../../db/db-api", () => ({
  connectToAlbumsCollection: jest.fn(() =>
    Promise.resolve({
      insertMany: mockInsertMany
    })
  )
}));

import { setAlbums } from "./albums-service";
import { connectToAlbumsCollection } from "../../db/db-api";
import { Album } from "./../../types";
import { fetchAlbums, generateUrl, getAlbums } from "./albums-service";
import { baseUrl } from "../../utilities/base-url/base-url";
import { generateAlbum } from "../../test/builders/album-builder";
import { toDataSet } from "../../utilities/album-utils/album-utils";
import fetch from "isomorphic-unfetch";

const emptySavedData = toDataSet([]);

const album1 = generateAlbum({
  releaseDate: "1983-12-18"
});
const album2 = generateAlbum({
  releaseDate: "1986-03-10"
});
const album3 = generateAlbum({
  releaseDate: "1996-10-20"
});

const savedAlbums = [album1, album2, album3];

const lastSavedAlbumId = "123";

describe("albums-service", () => {
  describe("getAlbums", () => {
    describe("with saved albums", () => {
      beforeEach(() => {
        mockGetLastSavedAlbumId.mockReturnValueOnce(mockSavedAlbumId);
        mockResponse.mockReturnValueOnce([album1, album2]);
      });

      it("should fetch the albums with the lastSaveAlbumId", async () => {
        await getAlbums(emptySavedData);
        expect(fetch).toHaveBeenCalledWith(generateUrl(mockSavedAlbumId));
      });

      it("should return the merged albums", async () => {
        expect(await getAlbums(toDataSet([album3]))).toEqual(
          toDataSet([album1, album2, album3])
        );
      });

      it("should set the last savedAlbumId", async () => {
        await getAlbums(emptySavedData);
        expect(mockSetLastSavedAlbumId).toHaveBeenCalledWith(album1.id);
      });

      it("should set the saved albums", async () => {
        await getAlbums(toDataSet([album3]));
        expect(mockSetSavedAlbums).toHaveBeenCalledWith(
          toDataSet([album1, album2, album3])
        );
      });
    });

    describe("without new saved albums", () => {
      it("should return the original saved data", async () => {
        expect(await getAlbums(emptySavedData)).toEqual(emptySavedData);
      });
    });
  });

  describe("generateUrl", () => {
    it("should generate url from the lastSavedAlbumId", () => {
      expect(generateUrl(lastSavedAlbumId)).toBe(
        `${baseUrl}/api/albums?lastSavedAlbumId=123`
      );
    });
  });

  describe("fetchAlbums", () => {
    it("should fetch with the url", async () => {
      await fetchAlbums(lastSavedAlbumId);
      expect(fetch).toHaveBeenCalledWith(generateUrl("123"));
    });

    it("should return the albums from the request", async () => {
      mockResponse.mockReturnValueOnce(mockAlbums);
      expect(await fetchAlbums(lastSavedAlbumId)).toBe(mockAlbums);
    });
  });

  describe("albums", () => {
    it("should connect to the albums collection", async () => {
      await setAlbums(savedAlbums);
      expect(connectToAlbumsCollection).toHaveBeenCalled();
    });

    it("retrieve the first document", async () => {
      await setAlbums(savedAlbums);
      expect(mockInsertMany).toHaveBeenCalledWith(
        [
          { _id: album1.id, releaseDateKey: "12-18" },
          { _id: album2.id, releaseDateKey: "03-10" },
          { _id: album3.id, releaseDateKey: "10-20" }
        ],
        { ordered: false }
      );
    });
  });
});
