const mockGetTopArtists = jest.fn();
const accessToken = "456";
const refreshToken = "789";
const userId = "000000000000";
const opts = { accessToken, refreshToken, userId };

jest.mock("../../utilities/spotify-api/spotify-api", () => ({
  getTopArtists: mockGetTopArtists
}));

jest.mock("../../db/favorite-genres/favorite-genres", () => ({
  writeFavoriteGenres: jest.fn()
}));

import { setFavoriteGenres } from "./favorite-genres";
import { getTopArtists } from "../../utilities/spotify-api/spotify-api";
import { writeFavoriteGenres } from "../../db/favorite-genres/favorite-genres";

describe("favorite-genres", () => {
  beforeEach(() => {
    mockGetTopArtists.mockResolvedValueOnce([
      {
        id: "first-artist",
        genres: ["rock", "metal"]
      },
      {
        id: "second-artist",
        genres: ["pop", "country", "rock"]
      }
    ]);
  });

  it("should get the top artists from spotify", async () => {
    await setFavoriteGenres(opts);
    expect(getTopArtists).toHaveBeenCalledWith({ accessToken, refreshToken });
  });

  it("should write to the db a key-value map of genres", async () => {
    await setFavoriteGenres(opts);
    expect(writeFavoriteGenres).toHaveBeenCalledWith(userId, {
      rock: true,
      metal: true,
      pop: true,
      country: true
    });
  });
});
