import React, { useContext, useState } from "react";
import "../assets/styles/Constructor.css";
import { ConstructorContext } from "../../context/ConstructoContext";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { Redirect } from "react-router";
import { useInput } from "../../hooks/input.hook";
import { useError } from "../../hooks/inputError.hook";
import { LINK } from "../../hooks/typesInputError";

export const CycleExcel = () => {
  const link = useInput("", { isEmpty: true, isLink: true });
  const nameCycle = useInput("", { isEmpty: true });
  const linkError = useError(LINK, link);
  const nameCycleError = useError("", nameCycle);
  const constructor = useContext(ConstructorContext);
  const { loading, error, request, clearError, setError } = useHttp();
  const auth = useContext(AuthContext);
  const [redirect, setRedirect] = useState(false);
  const handleCreate = async () => {
    try {
      auth.setRefresh(true);
      if (link.value === "") link.setDirty(true);
      if (nameCycle.value === "") nameCycle.setDirty(true);
      if (
        link.value !== "" &&
        nameCycle.value !== "" &&
        linkError === "" &&
        nameCycleError === ""
      ) {
        constructor.setReq(true);
        const data = await request(
          "/api/constructor/createExcel",
          "POST",
          {
            link: link.value,
            name: nameCycle.value,
            date: new Date(),
          },
          { Authorization: `Bearer ${auth.token}` }
        );
        constructor.setReq(false);
        if (data.ok) setRedirect(true);
      }
    } catch (e) {
      if (e.message === "Auth error") {
        auth.logout();
      }
    }
  };

  return (
    <div className="contaner-cycles">
      <div className="wrapper">
        <h1>Тренировки в Excel</h1>
        <div className="excel_training">
          <div className="description">
            <p>Введите ссылку на документ</p>
            <p>Введите название цикла</p>
          </div>
          <div className="wraper_values">
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
            <p className="link_error">{linkError}</p>
            <div className="input_wrap">
              <input
                onChange={(e) => nameCycle.onChange(e)}
                onBlur={(e) => nameCycle.onBlur(e)}
                value={nameCycle.value}
                type="text"
                className="input_"
                placeholder="Цикл"
              />
            </div>
            <p className="name_error">{nameCycleError}</p>
          </div>
        </div>
        <div onClick={() => handleCreate()} className="btn btn1">
          Создать
        </div>
        {error !== "" && <div className="error_req">{error}</div>}
      </div>
      <div className="footter">
        <span>©2021 CYCLES. ALL RIGHTS RECERVED</span>
      </div>
      {redirect && <Redirect to="/workout" />}
    </div>
  );
};
