import cookieSession from "cookie-session";

export const cookieSessionMiddleware = cookieSession({
  name: "nostalgiafy-spotify-user",
  keys: [process.env.COOKIE_KEY as string],
  // Cookie Options
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
});
