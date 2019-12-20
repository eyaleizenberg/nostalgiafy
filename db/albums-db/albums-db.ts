import { Album } from "../../types";
import { connectToDatabase } from "../db-api";
import { Collection, InsertWriteOpResult } from "mongodb";

export const connectToAlbumsCollection = async (): Promise<Collection> => {
  const db = await connectToDatabase(process.env.MONGODB_URL as string);
  return db.collection("albums");
};

export const setAlbums = async (
  albums: Album[]
): Promise<InsertWriteOpResult> => {
  const collection = await connectToAlbumsCollection();
  const albumsForCollection = albums.map(album => ({
    ...album,
    _id: album.id
  }));

  return collection.insertMany(albumsForCollection, { ordered: false });
};

export const fetchAlbums = async (releaseDateKey: string): Promise<Album[]> => {
  const collection = await connectToAlbumsCollection();
  const response = await collection.find({ releaseDateKey });
  return response.toArray();
};
