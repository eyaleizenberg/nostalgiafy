const mockSavedAlbumId = 123;
const mockFetchAlbums = jest.fn();
const mockSetLastSavedAlbumId = jest.fn();
const mockSetSavedAlbums = jest.fn();
const mockGetLastSavedAlbumId = jest.fn();

import { getAlbums } from "./albums-service";
import { generateAlbum } from "../../test/builders/album-builder";
import { toDataSet } from "../album-utils/album-utils";

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

const albums = [album1, album2];

jest.mock("../../services/albums-service/albums-service", () => ({
  fetchAlbums: mockFetchAlbums
}));

jest.mock("../localstorage", () => ({
  setLastSavedAlbumId: mockSetLastSavedAlbumId,
  setSavedAlbums: mockSetSavedAlbums,
  getLastSavedAlbumId: mockGetLastSavedAlbumId
}));

describe("albums service", () => {
  describe("with saved albums", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      mockGetLastSavedAlbumId.mockReturnValueOnce(mockSavedAlbumId);
      mockFetchAlbums.mockResolvedValueOnce(albums);
    });

    it("should fetch the albums with the lastSaveAlbumId", async () => {
      await getAlbums(emptySavedData);
      expect(mockFetchAlbums).toHaveBeenCalledWith(mockSavedAlbumId);
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
