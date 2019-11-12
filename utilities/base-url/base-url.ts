export const localUrl = "http://localhost:3000";
export const prodUrl = "https://www.nostalgiafy.com";
const dev = process.env.NODE_ENV !== "production";
export const baseUrl = dev ? localUrl : prodUrl;
