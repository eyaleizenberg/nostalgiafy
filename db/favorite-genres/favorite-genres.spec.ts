const mockFindOneAndUpdate = jest.fn();
const mockFindOne = jest.fn();
const mockCollection = jest.fn(() => ({
  findOneAndUpdate: mockFindOneAndUpdate,
  findOne: mockFindOne
}));
const userId = "000000000000";
const genres = { metal: true };

jest.mock("../db-api", () => ({
  connectToDatabase: jest.fn(() =>
    Promise.resolve({
      collection: mockCollection
    })
  )
}));

import { connectToDatabase } from "../db-api";
import {
  connectToFavoriteGenresCollection,
  writeFavoriteGenres,
  fetchFavoriteGenres
} from "./favorite-genres";
import { ObjectId } from "bson";

describe("favorite-genres-db", () => {
  test("should connect to the db", async () => {
    await connectToFavoriteGenresCollection();
    expect(connectToDatabase).toHaveBeenCalledWith(process.env.MONGODB_URL);
  });

  test("should return favorite-genres collection", async () => {
    await connectToFavoriteGenresCollection();
    expect(mockCollection).toHaveBeenCalledWith("favorite-genres");
  });

  test("should update according to the spotifyId", async () => {
    await writeFavoriteGenres(userId, genres);
    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: new ObjectId(userId)
      },
      { $set: genres },
      {
        upsert: true
      }
    );
  });

  test("should retrieve the favorite genres for user", async () => {
    await fetchFavoriteGenres(userId);
    expect(mockFindOne).toHaveBeenCalledWith({
      _id: new ObjectId(userId)
    });
  });
});
