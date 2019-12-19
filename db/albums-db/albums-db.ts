import { Album } from "../../types";
import { connectToDatabase } from "../db-api";
import { Collection } from "mongodb";

export const connectToAlbumsCollection = async (): Promise<Collection> => {
  const db = await connectToDatabase(process.env.MONGODB_URL as string);
  return db.collection("albums");
};

export const setAlbums = async (albums: Album[]) => {
  const collection = await connectToAlbumsCollection();
  const albumsForCollection = albums.map(album => ({
    ...album,
    _id: album.id
  }));
  try {
    await collection.insertMany(albumsForCollection, { ordered: false });
  } catch (err) {
    console.log("!!!!!!1", err);
  }
};
