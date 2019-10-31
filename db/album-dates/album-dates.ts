import { connectToAlbumDatesCollection } from "../db-api";
import { DateToAlbumIds } from "../../types";

export const setAlbumDates = async (albumsDates: DateToAlbumIds) => {
  const collection = await connectToAlbumDatesCollection();
  collection.findOneAndUpdate(
    {},
    { $set: albumsDates },
    {
      upsert: true
    }
  );
};
