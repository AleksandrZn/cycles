import { Input } from "./Input";
import { NavLink } from "react-router-dom";
import { Error } from "./Error";
import { Warning } from "../Warning";
import { CSSTransition } from "react-transition-group";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { InputContext } from "../../context/InputContext";

export const Login = (props) => {
  const [visibility, setVisibility] = useState(false);

  const clickVisible = () => {
    if (visibility) {
      setVisibility(false);
    } else {
      setVisibility(true);
    }
  };

  const auth = useContext(AuthContext);
  const login = useContext(InputContext);
  const submitHandler = async () => {
    try {
      const data = await login.request("/api/auth/login", "POST", {
        email: login.email.value,
        password: login.password.value,
      });
      auth.login(data.token, data.exp);
    } catch (e) {}
  };
  return (
    <form className="form-reg" onClick={login.clearError}>
      <h1>АВТОРИЗАЦИЯ</h1>
      <Warning error={login.error} />
      <div className="input-info">
        <CSSTransition in={login.emailError} classNames={"input"}>
          <Input
            onChange={(e) => login.email.onChange(e)}
            onBlur={(e) => login.email.onBlur(e)}
            value={login.email.value}
            type="email"
            placeholder="Email"
          />
        </CSSTransition>
        <Error textError={login.emailError} />
        <div className="password">
          <CSSTransition in={login.passwordError} classNames={"input"}>
            <Input
              onChange={(e) => login.password.onChange(e)}
              onBlur={(e) => login.password.onBlur(e)}
              value={login.password.value}
              className="password"
              type={visibility ? "text" : "password"}
              maxLength="30"
              placeholder="Пароль"
            />
          </CSSTransition>
          <div
            onClick={() => clickVisible()}
            className={
              visibility ? "password-control" : "password-control view"
            }
          ></div>
        </div>
        <Error textError={login.passwordError} />
        <div className="link">
          <NavLink
            to="/register"
            onClick={() =>
              login.resetInput([
                login.email,
                login.password,
                login.checkPassword,
              ])
            }
          >
            Регистрация
          </NavLink>
          <NavLink
            to="/reset"
            onClick={() =>
              login.resetInput([
                login.email,
                login.password,
                login.checkPassword,
              ])
            }
          >
            Забыли пароль?
          </NavLink>
        </div>
        <div
          onClick={
            login.loading ||
            !login.password.inputValid ||
            !login.email.inputValid
              ? () => login.showDisabled([login.password, login.email])
              : submitHandler
          }
          className={"btn btn1"}
        >
          ВОЙТИ
        </div>
      </div>
    </form>
  );
};
