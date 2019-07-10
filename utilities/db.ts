import { User, UserWithId } from "./../types/user";
import url, { UrlWithStringQuery } from "url";
import { MongoClient, Db, Collection, ObjectId } from "mongodb";

let cachedDb: Db;

const connectToDatabase = async (uri: string): Promise<Db> => {
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
  const collection = await db.collection("users");
  return collection;
};

export const findUserBySpotifyId = async (id: string): Promise<UserWithId> => {
  const collection = await connectToUsersCollection();
  const user = await collection.findOne({ id });
  return user;
};

export const createUser = async (user: User): Promise<UserWithId> => {
  const collection = await connectToUsersCollection();
  const response = await collection.insert(user);
  return response.ops[0];
};

export const findOrCreateUser = async (user: User): Promise<UserWithId> => {
  let userWithId: UserWithId;
  userWithId = await findUserBySpotifyId(user.id);

  if (!user) {
    user = await createUser(user);
  }

  return userWithId;
};

export const findUserById = async (id: string): Promise<UserWithId> => {
  const collection = await connectToUsersCollection();
  const user = await collection.findOne({ _id: new ObjectId(id) });
  return user;
};
