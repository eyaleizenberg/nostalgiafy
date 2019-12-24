import { User, UserWithId, Tokens } from "../../types";
import { ObjectId } from "mongodb";
import { connectToUsersCollection } from "../../db/db-api";
import { getNewAccessToken } from "../../utilities/spotify-api/spotify-api";

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
  const user = collection.findOne({ _id: new ObjectId(id) });
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

export const refreshAccessToken = async (
  id: string,
  tokens: Tokens
): Promise<string> => {
  const newToken = await getNewAccessToken({ ...tokens });
  await updateUser(id, { accessToken: newToken });
  return newToken;
};
