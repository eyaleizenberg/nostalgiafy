import { User } from "../../types";
import { connectToUsersCollection } from "../../db/db-api";
import * as userService from "./user";
import { ObjectId } from "mongodb";
import { getNewAccessToken } from "../../utilities/spotify-api/spotify-api";

const {
  findOrCreateUserFromSpotify,
  updateUser,
  findUserById,
  refreshAccessToken
} = userService;

const mockUser = { id: "123" } as User;
const mockUserWithId = { ...mockUser, _id: "000000000000" };
const mockFindOneAndUpdate = jest.fn(() =>
  Promise.resolve({ value: mockUserWithId })
);

const mockFindOne = jest.fn(() => Promise.resolve(mockUserWithId));
const partialUser = { displayName: "new name" };
const tokens = { accessToken: "888", refreshToken: "777" };
const mockNewAccessToken = "09876543";

jest.mock("../../db/db-api", () => ({
  connectToUsersCollection: jest.fn(() =>
    Promise.resolve({
      findOneAndUpdate: mockFindOneAndUpdate,
      findOne: mockFindOne
    })
  )
}));

jest.mock("../../utilities/spotify-api/spotify-api", () => ({
  getNewAccessToken: jest.fn(() => Promise.resolve(mockNewAccessToken))
}));

describe("user service", () => {
  describe("findOrCreateUserFromSpotify", () => {
    it("should call the connectToUsersCollection", async () => {
      await findOrCreateUserFromSpotify(mockUser);
      expect(connectToUsersCollection).toHaveBeenCalled();
    });

    it("should find and upsert the user", async () => {
      await findOrCreateUserFromSpotify(mockUser);
      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        {
          id: mockUser.id
        },
        {
          $set: mockUser
        },
        {
          upsert: true
        }
      );
    });

    it("should return the user", async () => {
      expect(await findOrCreateUserFromSpotify(mockUser)).toBe(mockUserWithId);
    });
  });

  describe("findUserById", () => {
    it("should connect to the users collection", async () => {
      await findUserById(mockUserWithId._id);
      expect(connectToUsersCollection).toHaveBeenCalled();
    });

    it("should find the user by internal id", async () => {
      await findUserById(mockUserWithId._id);
      expect(mockFindOne).toHaveBeenCalledWith({
        _id: new ObjectId(mockUserWithId._id)
      });
    });

    it("should return the user", async () => {
      expect(await findUserById(mockUserWithId._id)).toBe(mockUserWithId);
    });
  });

  describe("updateUser", () => {
    it("should connectToUsersCollection", async () => {
      await updateUser(mockUserWithId._id, partialUser);
      expect(connectToUsersCollection).toHaveBeenCalled();
    });

    it("should find and upsert the user", async () => {
      await updateUser(mockUserWithId._id, partialUser);
      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        {
          _id: new ObjectId(mockUserWithId._id)
        },
        {
          $set: partialUser
        }
      );
    });

    it("should return the user", async () => {
      expect(await updateUser(mockUserWithId._id, partialUser)).toBe(
        mockUserWithId
      );
    });
  });

  describe("refreshAccessToken", () => {
    beforeEach(() => {
      jest.spyOn(userService, "updateUser").mockResolvedValue(mockUserWithId);
    });

    it("should get a new accessToken from spotify", async () => {
      await refreshAccessToken(mockUserWithId._id, tokens);
      expect(getNewAccessToken).toHaveBeenCalledWith(tokens);
    });

    it("should update the user with the new token", async () => {
      await refreshAccessToken(mockUserWithId._id, tokens);
      expect(userService.updateUser).toHaveBeenCalledWith(mockUserWithId._id, {
        accessToken: mockNewAccessToken
      });
    });

    test("should return the new accessToken", async () => {
      expect(await refreshAccessToken(mockUserWithId._id, tokens)).toBe(
        mockNewAccessToken
      );
    });
  });
});
