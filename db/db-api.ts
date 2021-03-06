import url, { UrlWithStringQuery } from "url";
import { MongoClient, Db, Collection } from "mongodb";

let cachedDb: Db;

export const connectToDatabase = async (uri: string): Promise<Db> => {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  const parsedUrl: UrlWithStringQuery = url.parse(uri);
  // @ts-ignore
  const db = await client.db(parsedUrl.pathname.substr(1));
  cachedDb = db;
  return db;
};

export const connectToUsersCollection = async (): Promise<Collection> => {
  const db = await connectToDatabase(process.env.MONGODB_URL as string);
  return db.collection("users");
};

