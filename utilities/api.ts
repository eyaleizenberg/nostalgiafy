import fetch from "isomorphic-unfetch";

export const getAlbums = async () => {
  const response = await fetch("http://localhost:3000/api/albums");
  console.log(await response.json());
};
