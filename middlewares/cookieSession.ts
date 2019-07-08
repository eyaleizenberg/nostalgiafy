import cookieSession from 'cookie-session';

export const cookieSessionMiddleware = cookieSession({
  name: "nostalgiafy-spotify-user",
  keys: [process.env.COOKIE_KEY as string],
  // domain: "localhost:3000",

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});

