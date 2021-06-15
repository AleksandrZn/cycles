import { Input } from "./Input";
import { Error } from "./Error";
import { Warning } from "../Warning";
import { CSSTransition } from "react-transition-group";
import { useContext, useState } from "react";
import { InputContext } from "../../context/InputContext";
import { Redirect } from "react-router";

export const ResetPassword = (props) => {
  const [visibility, setVisibility] = useState(false);

  const clickVisible = () => {
    if (visibility) {
      setVisibility(false);
    } else {
      setVisibility(true);
    }
  };
  const reset = useContext(InputContext);
  const [response, setResponse] = useState("");
  const resetWarnings = () => {
    reset.clearError();
    setResponse("");
  };
  const submitHandler = async () => {
    try {
      setTimeout(() => {
        window.location.href = "/login";
      }, 2 * 1000);
      const pathApi = window.location.pathname;
      const arr = pathApi.replace("/resetpassword/", "").split("/");
      const data = await reset.request("/api/auth/resetpassword", "POST", {
        password: reset.password.value,
        id: arr[0],
        token: arr[1],
      });
      setResponse(data.message);
      return <Redirect to="/login" />;
    } catch (e) {}
  };
  return (
    <form className="form-reg" onClick={resetWarnings}>
      <h1>СМЕНА ПАРОЛЯ</h1>
      <Warning
        className={reset.error || "good_warning"}
        error={reset.error || response}
      />
      <div className="input-info">
        <div className="password">
          <CSSTransition in={reset.passwordError} classNames={"input"}>
            <Input
              onChange={(e) => reset.password.onChange(e)}
              onBlur={(e) => reset.password.onBlur(e)}
              value={reset.password.value}
              className="password"
              type={visibility ? "text" : "password"}
              placeholder="Новый пароль"
            />
          </CSSTransition>
          <div
            onClick={() => clickVisible()}
            className={
              visibility ? "password-control" : "password-control view"
            }
          ></div>
        </div>
        <Error textError={reset.passwordError} />
        <CSSTransition
          in={reset.checkPasswordError || reset.comparePassword}
          classNames={"input"}
        >
          <Input
            onChange={(e) => reset.checkPassword.onChange(e)}
            onBlur={(e) => reset.checkPassword.onBlur(e)}
            value={reset.checkPassword.value}
            className="secondpassword"
            type="password"
            placeholder="Повторите пароль"
          />
        </CSSTransition>
        <Error textError={reset.comparePassword || reset.checkPasswordError} />
        <div
          onClick={
            reset.loading ||
            !reset.password.inputValid ||
            !reset.checkPassword.inputValid ||
            reset.comparePassword
              ? () =>
                  reset.showDisabled([
                    reset.password,
                    reset.email,
                    reset.checkPassword,
                  ])
              : submitHandler
          }
          className={"btn btn1"}
        >
          СМЕНИТЬ ПАРОЛЬ
        </div>
      </div>
    </form>
  );
};
