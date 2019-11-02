import { connectToFavoriteGenresCollection } from "../../db/db-api";
import { Tokens, Artist, Genres } from "../../types";
import {
  getTopArtists,
  getNewAccessToken
} from "../../utilities/spotify-api/spotify-api";
import { updateUser } from "../user/user";

export interface SetFavoriteGenresOpts extends Tokens {
  spotifyId: string;
  userId: string;
}

const generateGenresMap = (artists: Artist[]): Genres =>
  artists.reduce((res: Genres, artist: Artist) => {
    const artistGenres = artist.genres.reduce((res: Genres, genre: string) => {
      return { ...res, [genre]: true };
    }, {});

    return { ...res, ...artistGenres };
  }, {});

const retrieveTopArtists = async ({
  accessToken,
  refreshToken,
  userId
}: {
  accessToken: string;
  refreshToken: string;
  userId: string;
}): Promise<Artist[]> => {
  try {
    const artists = await getTopArtists({ accessToken, refreshToken });
    return artists;
  } catch (error) {
    if (error.statusCode === 401) {
      const newToken = await getNewAccessToken({ accessToken, refreshToken });
      // @ts-ignore
      const [_user, artists] = await Promise.all([
        updateUser(userId, { accessToken: newToken }),
        getTopArtists({ accessToken, refreshToken })
      ]);

      return artists;
    }

    throw new Error("Can't get spotify data for this user");
  }
};

export const setFavoriteGenres = async ({
  spotifyId,
  accessToken,
  refreshToken,
  userId
}: SetFavoriteGenresOpts) => {
  const collection = await connectToFavoriteGenresCollection();
  const topArtists = await retrieveTopArtists({
    accessToken,
    refreshToken,
    userId
  });
  const genres = generateGenresMap(topArtists);

  collection.findOneAndUpdate(
    {
      spotifyId
    },
    { $set: genres },
    {
      upsert: true
    }
  );
};
