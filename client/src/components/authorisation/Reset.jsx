import { Input } from "./Input";
import { NavLink } from "react-router-dom";
import { Error } from "./Error";
import { Warning } from "../Warning";
import { CSSTransition } from "react-transition-group";
import { useContext, useState } from "react";
import { InputContext } from "../../context/InputContext";

export const Reset = (props) => {
  const reset = useContext(InputContext);
  const [response, setResponse] = useState("");
  const submitHandler = async () => {
    try {
      const data = await reset.request("/api/auth/reset", "POST", {
        email: reset.email.value,
      });
      setResponse(data.message);
    } catch (e) {}
  };

  const resetWarnings = () => {
    reset.clearError();
    setResponse("");
  };
  return (
    <form className="form-reg" onClick={resetWarnings}>
      <h1>СБРОС ПАРОЛЯ</h1>
      <Warning
        className={response && "good_warning"}
        error={reset.error || response}
      />
      <div className="input-info">
        <CSSTransition in={reset.emailError} classNames={"input"}>
          <Input
            onChange={(e) => reset.email.onChange(e)}
            onBlur={(e) => reset.email.onBlur(e)}
            value={reset.email.value}
            type="email"
            placeholder="Email"
          />
        </CSSTransition>
        <Error textError={reset.emailError} />
        <div className="link">
          <NavLink
            to="/login"
            onClick={() => reset.resetInput([reset.email], "", false)}
          >
            Войти
          </NavLink>
          <NavLink
            to="/register"
            onClick={() => reset.resetInput([reset.email], "", false)}
          >
            Регистрация
          </NavLink>
        </div>
        <div
          onClick={
            reset.loading || !reset.email.inputValid
              ? () => reset.showDisabled([reset.email])
              : submitHandler
          }
          className={"btn btn1"}
        >
          ОТПРАВИТЬ ПИСЬМО
        </div>
      </div>
    </form>
  );
};
