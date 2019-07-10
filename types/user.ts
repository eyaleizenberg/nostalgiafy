export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface Profile {
  provider: string;
  id: string;
  username: string;
  displayName: string;
  profileUrl: string;
  photos: string[];
  country: string;
  followers: number;
  product: string;
}

export interface ProfileWithRaw extends Profile {
  _raw: string;
  _json: Object;
}

export interface User extends Profile, Tokens {}

export interface UserWithId extends User {
  _id: string;
}
