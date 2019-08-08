import { User, UserWithId } from "../types";
import { ObjectId } from "mongodb";
import { connectToUsersCollection } from "./db-api";

export const findOrCreateUserFromSpotify = async (
  user: User
): Promise<UserWithId> => {
  const collection = await connectToUsersCollection();
  const response = await collection.findOneAndUpdate(
    {
      id: user.id
    },
    { $set: user },
    {
      upsert: true
    }
  );
  return response.value;
};

export const findUserById = async (id: string): Promise<UserWithId> => {
  const collection = await connectToUsersCollection();
  const user = await collection.findOne({ _id: new ObjectId(id) });
  return user;
};

export const updateUser = async (id: string, user: Partial<UserWithId>) => {
  const collection = await connectToUsersCollection();
  const response = await collection.findOneAndUpdate(
    {
      _id: new ObjectId(id)
    },
    { $set: user }
  );

  return response.value;
};
