import { createContext } from "react";
function noop() {}
export const InputContext = createContext({
  email: null,
  password: null,
  checkPassword: null,
  emailError: null,
  passwordError: null,
  checkPasswordError: null,
  comparePassword: null,
  loading: null,
  error: null,
  request: noop,
  clearError: noop,
  setError: noop,
  resetInput: noop,
  showDisabled: noop,
});
