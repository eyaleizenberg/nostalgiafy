const mockFindOneAndUpdate = jest.fn();
const mockGetTopArtists = jest.fn();
const spotifyId = "123";
const accessToken = "456";
const refreshToken = "789";
const userId = "000";
const opts = { spotifyId, accessToken, refreshToken, userId };

jest.mock("../db-api", () => ({
  connectToFavoriteGenresCollection: jest.fn(() =>
    Promise.resolve({
      findOneAndUpdate: mockFindOneAndUpdate
    })
  )
}));

jest.mock("../../utilities/spotify-api/spotify-api", () => ({
  getTopArtists: mockGetTopArtists
}));

import { setFavoriteGenres } from "./favorite-genres";
import { connectToFavoriteGenresCollection } from "../db-api";
import { getTopArtists } from "../../utilities/spotify-api/spotify-api";

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

  it("should connect to the favorite-genres collection", async () => {
    await setFavoriteGenres(opts);
    expect(connectToFavoriteGenresCollection).toHaveBeenCalled();
  });

  it("should get the top artists from spotify", async () => {
    await setFavoriteGenres(opts);
    expect(getTopArtists).toHaveBeenCalledWith({ accessToken, refreshToken });
  });

  it("should write to the db a key-value map of genres", async () => {
    await setFavoriteGenres(opts);
    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      {
        spotifyId
      },
      {
        $set: {
          rock: true,
          pop: true,
          country: true,
          metal: true
        }
      },
      {
        upsert: true
      }
    );
  });
});
