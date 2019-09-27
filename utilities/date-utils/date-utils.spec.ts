import { generateTodayKey } from "./date-utils";

const oldDate = 440577500000;

describe("date-utils", () => {
  it("should generate the date with zero pad keys", () => {
    jest.spyOn(Date, "now").mockReturnValue(oldDate);
    expect(generateTodayKey()).toBe("12-18");
  });
});
