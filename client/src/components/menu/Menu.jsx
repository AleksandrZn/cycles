import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../assets/styles/Menu.css";
import logout from "../assets/images/logout2.svg";
import logo from "../assets/images/CyclesLogo.svg";
import { Warning } from "../Warning";
import { useHttp } from "../../hooks/http.hook";
import { Redirect, Route } from "react-router";
import { Loader } from "../Loader";

export const Menu = () => {
  const auth = useContext(AuthContext);
  const [redirectConst, setRedirectConst] = useState(false);
  const [redirectWorkout, setRedirectWorkout] = useState(false);
  const [redirectNutrition, setRedirectNutrition] = useState(false);
  const [redirectArchive, setRedirectArchive] = useState(false);
  const { loading, request, error, clearError } = useHttp();

  const constructorClick = async () => {
    try {
      auth.setRefresh(true);
      const data = await request(
        "/api/menu/constructor",
        "POST",
        {},
        { Authorization: `Bearer ${auth.token}` }
      );
      if (data.ok) {
        setRedirectConst(true);
      }
    } catch (e) {
      if (e.message === "Auth error") {
        auth.logout();
      }
    }
  };
  const workoutClick = async () => {
    try {
      auth.setRefresh(true);
      const data = await request(
        "/api/menu/workout",
        "POST",
        {},
        { Authorization: `Bearer ${auth.token}` }
      );
      if (data.ok) {
        setRedirectWorkout(true);
      }
    } catch (e) {
      if (e.message === "Auth error") {
        auth.logout();
      }
    }
  };
  const nutritionClick = async () => {
    try {
      auth.setRefresh(true);
      const data = await request(
        "/api/menu/nutrition",
        "POST",
        {},
        { Authorization: `Bearer ${auth.token}` }
      );
      if (data.ok) {
        setRedirectNutrition(true);
      }
    } catch (e) {
      if (e.message === "Auth error") {
        auth.logout();
      }
    }
  };
  const archiveClick = async () => {
    try {
      auth.setRefresh(true);
      const data = await request(
        "/api/menu/archive",
        "POST",
        {},
        { Authorization: `Bearer ${auth.token}` }
      );
      if (data.ok) {
        setRedirectArchive(true);
      }
    } catch (e) {
      if (e.message === "Auth error") {
        auth.logout();
      }
    }
  };
  return (
    <div className="container">
      {redirectConst && <Redirect to="/constructor" />}
      {redirectArchive && <Redirect to="/archive" />}
      {redirectNutrition && <Redirect to="/nutrition" />}
      {redirectWorkout && <Redirect to="/workout" />}
      {error && <Warning className="warning_info" error={error} />}
      {(error || loading) && (
        <div onClick={() => clearError()} className="background_back"></div>
      )}
      {loading && <Loader />}
      <img className="logo" src={logo} alt="logo"></img>
      <img
        onClick={() => auth.logout()}
        className="out"
        src={logout}
        alt="Out"
      ></img>
      <div className="constructor" onClick={constructorClick}>
        <div className="symbole">К</div>
        <div className="description description_1">
          Конструктор тренировок и питания
        </div>
        <p>
          Создание тренировчных циклов и планов питания. Создание тренировочных
          циклов и питания
        </p>
      </div>
      <div className="traning" onClick={workoutClick}>
        <div className="symbole">Т</div>
        <div className="description">Текущие тренировки</div>
        <p>
          Создание тренировчных циклов и планов питания. Создание тренировочных
          циклов и питания
        </p>
      </div>
      <div className="food" onClick={nutritionClick}>
        <div className="symbole">П</div>
        <div className="description">Текущий режим питания</div>
        <p>
          Создание тренировчных циклов и планов питания. Создание тренировочных
          циклов и питания
        </p>
      </div>
      <div className="archive" onClick={archiveClick}>
        <div className="symbole">А</div>
        <div className="description">Архив тренировок</div>
        <p>
          Создание тренировчных циклов и планов питания. Создание тренировочных
          циклов и питания
        </p>
      </div>
    </div>
  );
};
