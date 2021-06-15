import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useAuth } from "../hooks/auth.hook";
import { useRoutes } from "./routes";
function App() {
  const { token, login, logout, setRefresh } = useAuth();
  const [visible, setVisible] = useState(false);
  const isAuthentiCated = !!token;
  const routes = useRoutes(isAuthentiCated);
  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        setRefresh,
        isAuthentiCated,
        visible,
        setVisible,
      }}
    >
      <BrowserRouter>{routes}</BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
