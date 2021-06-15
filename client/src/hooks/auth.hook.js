import { useState, useCallback, useEffect } from "react";

const storageName = "userData";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [refresh, setRefresh] = useState(true);

  const login = useCallback((jwtToken) => {
    setToken(jwtToken);
    localStorage.setItem(
      storageName,
      JSON.stringify({
        token: jwtToken,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
    const data = JSON.parse(localStorage.getItem(storageName));
    if (data && data.token) {
      login(data.token);
    } else {
      logout();
    }
  }, [login, refresh]);

  return { login, logout, token, setRefresh };
};
