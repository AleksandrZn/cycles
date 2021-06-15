import { createContext } from "react";
function noop() {}
export const AuthContext = createContext({
  token: null,
  login: noop,
  logout: noop,
  setRefresh: noop,
  isAuthentiCated: false,
  visible: false,
  setVisible: noop,
});
