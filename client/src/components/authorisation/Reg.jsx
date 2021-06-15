import { Input } from "./Input";
import { NavLink } from "react-router-dom";
import { Error } from "./Error";
import { Warning } from "../Warning";
import { CSSTransition } from "react-transition-group";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { InputContext } from "../../context/InputContext";

export const Reg = (props) => {
  const auth = useContext(AuthContext);
  const reg = useContext(InputContext);
  const [visibility, setVisibility] = useState(false);

  const clickVisible = () => {
    if (visibility) {
      setVisibility(false);
    } else {
      setVisibility(true);
    }
  };
  const submitHandler = async () => {
    try {
      const data = await reg.request("/api/auth/register", "POST", {
        email: reg.email.value,
        password: reg.password.value,
      });
      if (data.reason) {
        const data = await reg.request("/api/auth/login", "POST", {
          email: reg.email.value,
          password: reg.password.value,
        });
        auth.login(data.token);
      }
    } catch (e) {}
  };
  return (
    <form className="form-reg" onClick={reg.clearError}>
      <h1>РЕГИСТРАЦИЯ</h1>
      <Warning error={reg.error} />
      <div className="input-info">
        <CSSTransition in={reg.emailError} classNames={"input"}>
          <Input
            onChange={(e) => reg.email.onChange(e)}
            onBlur={(e) => reg.email.onBlur(e)}
            value={reg.email.value}
            type="email"
            placeholder="Email"
          />
        </CSSTransition>
        <Error textError={reg.emailError} />
        <div className="password">
          <CSSTransition in={reg.passwordError} classNames={"input"}>
            <Input
              onChange={(e) => reg.password.onChange(e)}
              onBlur={(e) => reg.password.onBlur(e)}
              value={reg.password.value}
              className="password"
              type={visibility ? "text" : "password"}
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
        <Error textError={reg.passwordError} />
        <CSSTransition
          in={reg.checkPasswordError || reg.comparePassword}
          classNames={"input"}
        >
          <Input
            onChange={(e) => reg.checkPassword.onChange(e)}
            onBlur={(e) => reg.checkPassword.onBlur(e)}
            value={reg.checkPassword.value}
            className="secondpassword"
            type="password"
            placeholder="Повторите пароль"
          />
        </CSSTransition>
        <Error textError={reg.comparePassword || reg.checkPasswordError} />
        <div className="link">
          <NavLink
            to="/login"
            onClick={() =>
              reg.resetInput(
                [reg.email, reg.password, reg.checkPassword],
                "",
                false
              )
            }
          >
            Войти
          </NavLink>
        </div>
        <div
          onClick={
            reg.loading ||
            !reg.password.inputValid ||
            !reg.email.inputValid ||
            !reg.checkPassword.inputValid ||
            reg.comparePassword
              ? () =>
                  reg.showDisabled([reg.password, reg.email, reg.checkPassword])
              : submitHandler
          }
          className={"btn btn1"}
        >
          ЗАРЕГЕСТРИРОВАТЬСЯ
        </div>
      </div>
    </form>
  );
};
