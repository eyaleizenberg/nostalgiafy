import { generateRawAlbumWithDate } from "./../../test/builders/album-builder";
import { ReleaseDatePrecision } from "./../../types";
import {
  normalizeAlbum,
  normalizeAndFilterAlbums,
  releaseDateKey,
  toDataSet
} from "./album-utils";

const rawAlbumDay = generateRawAlbumWithDate({
  release_date_precision: ReleaseDatePrecision.DAY,
  release_date: "1983-12-18"
});

const rawAlbumDay2 = generateRawAlbumWithDate({
  release_date_precision: ReleaseDatePrecision.DAY,
  release_date: "1983-12-18"
});

const rawAlbumDay3 = generateRawAlbumWithDate({
  release_date_precision: ReleaseDatePrecision.DAY,
  release_date: "2015-08-27"
});

const rawAlbumMonth = generateRawAlbumWithDate({
  release_date_precision: ReleaseDatePrecision.MONTH
});

describe("album-utils", () => {
  it("should normalize an album", () => {
    const rawAlbum = rawAlbumDay.album;
    expect(normalizeAlbum(rawAlbum)).toEqual({
      artist: rawAlbum.artists[0].name,
      artistId: rawAlbum.artists[0].id,
      id: rawAlbum.id,
      imageUrl: rawAlbum.images[0].url,
      name: rawAlbum.name,
      releaseDate: rawAlbum.release_date
    });
  });

  it("should normalize and keep only albums with 'day' precision release date", () => {
    expect(
      normalizeAndFilterAlbums([rawAlbumDay, rawAlbumDay2, rawAlbumMonth])
    ).toEqual([
      normalizeAlbum(rawAlbumDay.album),
      normalizeAlbum(rawAlbumDay2.album)
    ]);
  });

  it("should remove the year and hyphen from the release date", () => {
    expect(releaseDateKey("1983-12-18")).toBe("12-18");
  });

  it("should make a data set from normalized albums", () => {
    const albums = normalizeAndFilterAlbums([
      rawAlbumDay,
      rawAlbumDay2,
      rawAlbumDay3
    ]);
    expect(toDataSet(albums)).toEqual({
      byDate: {
        [releaseDateKey(rawAlbumDay.album.release_date)]: {
          [rawAlbumDay.album.id]: true,
          [rawAlbumDay2.album.id]: true
        },
        [releaseDateKey(rawAlbumDay3.album.release_date)]: {
          [rawAlbumDay3.album.id]: true
        }
      },
      albumsInfo: {
        [rawAlbumDay.album.id]: normalizeAlbum(rawAlbumDay.album),
        [rawAlbumDay2.album.id]: normalizeAlbum(rawAlbumDay2.album),
        [rawAlbumDay3.album.id]: normalizeAlbum(rawAlbumDay3.album)
      }
    });
  });
});
