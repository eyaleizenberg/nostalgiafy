const dev = process.env.NODE_ENV !== "production";
export const baseUrl = dev
  ? "http://localhost:3000"
  : "http://nextjs.eyale.now.sh";
