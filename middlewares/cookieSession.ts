import cookieSession from 'cookie-session';

export const cookieSessionMiddleware = cookieSession({
  name: "user-from-twitter",
  keys: [process.env.COOK_KEY as string],
  domain: "serverless-express.now.sh",

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});

