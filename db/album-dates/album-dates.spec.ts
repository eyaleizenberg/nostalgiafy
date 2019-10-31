import { connectToAlbumDatesCollection } from "../db-api";
import { DateToAlbumIds } from "../../types";
import { setAlbumDates } from "./album-dates";

const mockAlbumDates: DateToAlbumIds = {
  "06-12": {
    id1: 1,
    id2: 1
  },
  "08-18": {
    id3: 1,
    id4: 1
  }
};

const mockFindAndUpdate = jest.fn();

jest.mock("../db-api", () => ({
  connectToAlbumDatesCollection: jest.fn(() =>
    Promise.resolve({
      findOneAndUpdate: mockFindAndUpdate
    })
  )
}));

describe("album-dates", () => {
  it("should connect to the album dates collection", async () => {
    await setAlbumDates(mockAlbumDates);
    expect(connectToAlbumDatesCollection).toHaveBeenCalled();
  });

  it("retrieve the first document", async () => {
    await setAlbumDates(mockAlbumDates);
    expect(mockFindAndUpdate).toHaveBeenCalledWith(
      {},
      { $set: mockAlbumDates },
      { upsert: true }
    );
  });
});
