export const generateTodayKey = (): string => {
  const date = new Date(Date.now());
  return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}`;
};
