const TOKEN_KEY = 'access_token';

export const authStorage = {
  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return sessionStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    sessionStorage.setItem(
      TOKEN_KEY,
      token,
    );
  },

  removeToken(): void {
    sessionStorage.removeItem(
      TOKEN_KEY,
    );
  },
};