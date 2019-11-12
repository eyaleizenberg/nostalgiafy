import { baseUrl, localUrl } from "./base-url";

describe("base-url", () => {
  it("should return the local baseUrl", () => {
    expect(baseUrl).toBe(localUrl);
  });
});
