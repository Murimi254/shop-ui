const REFRESH_TOKEN_KEY = "refresh_token";
export const tokenStorage = {
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken(refreshToken: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clearRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
