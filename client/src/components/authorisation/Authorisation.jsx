import { Route } from "react-router-dom";
import { useCompare, useError } from "../../hooks/inputError.hook";
import { useHttp } from "../../hooks/http.hook";
import { useInput } from "../../hooks/input.hook";
import { EMAIL, PASSWORD } from "../../hooks/typesInputError";
import { InputContext } from "../../context/InputContext";
import "../assets/styles/Auth.css";
import { Reg } from "./Reg";
import { Login } from "./Login";
import { Reset } from "./Reset";
import { ResetPassword } from "./ResetPassword";
import { CSSTransition } from "react-transition-group";
import { Loader } from "../Loader";

const AuthPage = () => {
  const { loading, error, request, clearError, setError } = useHttp();

  const resetInput = (inputs) => {
    inputs.map((input) => {
      input.setValue("");
      input.setDirty(false);
    });
  };

  const showDisabled = (inputs) => {
    inputs.map((input) => {
      input.setDirty(true);
    });
  };

  const email = useInput("", { isEmpty: true, isEmail: true });
  const password = useInput("", { isEmpty: true, minLength: 6, maxLength: 25 });
  const checkPassword = useInput("", { isEmpty: true });
  const emailError = useError(EMAIL, email);
  const passwordError = useError(PASSWORD, password);
  const checkPasswordError = useError(PASSWORD, checkPassword);
  const comparePassword = useCompare(password.value, checkPassword);

  const routes = [
    { path: "/login", Component: Login },
    { path: "/register", Component: Reg },
    { path: "/reset", Component: Reset },
    { path: "/resetpassword/:id/:token", Component: ResetPassword },
  ];

  return (
    <InputContext.Provider
      value={{
        email,
        password,
        checkPassword,
        emailError,
        passwordError,
        checkPasswordError,
        comparePassword,
        loading,
        error,
        request,
        clearError,
        setError,
        resetInput,
        showDisabled,
      }}
    >
      <div className="contaner_auth_reg">
        {loading && <Loader />}
        {loading && <div className="background_back"></div>}

        {routes.map(({ path, Component }) => (
          <Route key={path} exact path={path}>
            {({ match }) => (
              <CSSTransition
                in={match != null}
                timeout={300}
                classNames="page"
                unmountOnExit
              >
                <div className="page">
                  <Component />
                </div>
              </CSSTransition>
            )}
          </Route>
        ))}
      </div>
    </InputContext.Provider>
  );
};

export default AuthPage;
