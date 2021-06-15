import { useContext, useState } from "react";
import { Redirect } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useInput } from "../hooks/input.hook";
import { useError } from "../hooks/inputError.hook";
import { LINK } from "../hooks/typesInputError";
import { Loader } from "./Loader";

export const Warning = (props) => {
  const auth = useContext(AuthContext);
  const [redirect, setRedirect] = useState(false);
  const { loading, error, request, clearError, setError } = useHttp();
  const questions = ["Завершить цикл?", "Удалить цикл?", "Обновление ссылки"];
  const clarification = [
    "В архив попадут только выполненные тренировки. Вы уверены?",
    "Удаление будет безвозвратным. Вы уверены?",
    "",
  ];
  const textButton = ["Завершить", "Удалить", "Обновить"];
  const link = useInput("", { isEmpty: true, isLink: true });
  const linkError = useError(LINK, link);
  const handleCancel = () => {
    auth.setVisible(false);
  };
  const handleToDo = async () => {
    try {
      auth.setRefresh(true);
      const date = new Date().toLocaleDateString();
      if (auth.visible === 1) {
        const data = await request(
          "/api/workout/access",
          "POST",
          {
            date: date,
          },
          { Authorization: `Bearer ${auth.token}` }
        );
        if (data.ok === true) setRedirect(true);
        auth.setVisible(false);
      } else if (auth.visible === 2) {
        const data = await request(
          "/api/workout/delete",
          "POST",
          {},
          { Authorization: `Bearer ${auth.token}` }
        );
        setRedirect(true);
        auth.setVisible(false);
      } else if (auth.visible === 3) {
        const data = await request(
          "/api/workout/refreshLink",
          "POST",
          { link: link.value },
          { Authorization: `Bearer ${auth.token}` }
        );
        if (data.ok) {
          auth.setVisible(false);
        }
      }
    } catch (e) {}
  };
  return (
    <div className={props.className || "bad_warning"}>
      {!loading && (props.error || auth.visible) && (
        <span>{props.error || questions[auth.visible - 1]} </span>
      )}
      {!loading && <p>{clarification[auth.visible - 1]}</p>}
      {!loading && auth.visible === 3 && (
        <div className="input_wrap">
          <input
            onChange={(e) => link.onChange(e)}
            onBlur={(e) => link.onBlur(e)}
            value={link.value}
            type="text"
            className="input_"
            placeholder="Ссылка"
          />
        </div>
      )}
      {!loading && auth.visible === 3 && (
        <p className="link_error">{error || linkError}</p>
      )}
      {!loading && (props.choise || false) && (
        <div>
          <div onClick={() => handleCancel()} className="btn btn1">
            Отмена
          </div>
          <div onClick={() => handleToDo()} className="btn btn1 second">
            {textButton[auth.visible - 1]}
          </div>
        </div>
      )}
      {loading && <Loader />}
      {redirect && <Redirect to="/" />}
    </div>
  );
};
