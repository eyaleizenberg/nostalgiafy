import { Genres } from "../../types";
import { Collection, ObjectId } from "mongodb";
import { connectToDatabase } from "../db-api";

export const connectToFavoriteGenresCollection = async (): Promise<Collection> => {
  const db = await connectToDatabase(process.env.MONGODB_URL as string);
  return db.collection("favorite-genres");
};

export const writeFavoriteGenres = async (userId: string, genres: Genres) => {
  const collection = await connectToFavoriteGenresCollection();
  collection.findOneAndUpdate(
    {
      _id: new ObjectId(userId)
    },
    { $set: genres },
    {
      upsert: true
    }
  );
};

export const fetchFavoriteGenres = async (
  userId: string
): Promise<Genres | null> => {
  const collection = await connectToFavoriteGenresCollection();
  return collection.findOne({
    _id: new ObjectId(userId)
  });
};
