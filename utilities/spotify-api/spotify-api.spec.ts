const mockGetMyTopArtists = jest.fn();
const mockGetArtists = jest.fn();
const mockArtist = { id: "123", genres: ["metal"] };

jest.mock("spotify-web-api-node");

import * as spotifyApi from "./spotify-api";
import SpotifyWebApi from "spotify-web-api-node";
import { AlbumRawWithDate } from "../../types";

const tokens = {
  accessToken: "accessToken",
  refreshToken: "refreshToken"
};

describe("spotify-api", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("should initialize the SpotifyWebApi", () => {
    process.env.SPOTIFY_TOKEN = "spotify-token";
    process.env.SPOTIFY_SECRET = "spotify-secret";
    spotifyApi.getClient(tokens);
    expect(SpotifyWebApi).toHaveBeenCalledWith({
      accessToken: "accessToken",
      clientId: "spotify-token",
      clientSecret: "spotify-secret",
      redirectUri: "http://localhost:3000/api/login",
      refreshToken: "refreshToken"
    });
  });

  describe("get artists", () => {
    const albumId = "123";
    const artists = ["some-artist"];

    beforeEach(() => {
      jest.spyOn(spotifyApi, "getClient").mockReturnValue({
        getArtists: mockGetArtists
      });
      mockGetArtists.mockResolvedValueOnce({ artists });
    });

    test("should retrieve the artists from spotify", async () => {
      await spotifyApi.getArtists({
        tokens,
        albumsIds: [albumId]
      });

      expect(mockGetArtists).toHaveBeenCalledWith([albumId]);
    });

    test("should return the artists", async () => {
      expect(
        await spotifyApi.getArtists({
          tokens,
          albumsIds: [albumId]
        })
      ).toBe(artists);
    });
  });

  describe("getAlbumsFromSpotify", () => {
    const allAlbums: AlbumRawWithDate[] = [];
    const albumsDelta: AlbumRawWithDate[] = [];

    beforeEach(() => {
      jest.spyOn(spotifyApi, "getAlbumsDelta").mockResolvedValue(albumsDelta);
      jest.spyOn(spotifyApi, "getAllAlbums").mockResolvedValue(allAlbums);
    });

    it("should fetch all the albums", async () => {
      spotifyApi.getAlbumsFromSpotify({ tokens });
      expect(spotifyApi.getAllAlbums).toHaveBeenCalledWith(tokens);
    });
  });

  describe("getTopArtists", () => {
    beforeEach(() => {
      jest.spyOn(spotifyApi, "getClient").mockReturnValue({
        getMyTopArtists: mockGetMyTopArtists
      });

      mockGetMyTopArtists.mockResolvedValue({
        body: { items: [{ id: "123", genres: ["metal"] }] }
      });
    });

    it("should initialize the client", async () => {
      await spotifyApi.getTopArtists(tokens);
      expect(spotifyApi.getClient).toHaveBeenCalledWith(tokens);
    });

    it("should call the getMyTopArtists from the client", async () => {
      await spotifyApi.getTopArtists(tokens);
      expect(mockGetMyTopArtists).toHaveBeenCalledWith({
        time_range: "long_term",
        limit: 50
      });
    });

    it("should return the items", async () => {
      expect(await spotifyApi.getTopArtists(tokens)).toEqual([mockArtist]);
    });
  });
});
