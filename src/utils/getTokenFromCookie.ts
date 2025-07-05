export const getTokenFromCookie = () => {
  if (typeof document === "undefined") return null;

  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("gup-shup-tkn="))
    ?.split("=")[1];
};
