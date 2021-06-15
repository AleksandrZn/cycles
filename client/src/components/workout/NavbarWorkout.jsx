import React from "react";
import { NavLink } from "react-router-dom";
import logout from "../assets/images/logout2.svg";
import logo from "../assets/images/CyclesLogo.svg";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export const NavbarWorkout = () => {
  const auth = useContext(AuthContext);
  return (
    <nav>
      <ul className="topmenu">
        <li className="logo">
          <NavLink to="/">
            <img src={logo} alt="logo" />
          </NavLink>
        </li>
        <div className="contaner_down">
          <li className="down_type">
            <p>СТАТИСТИКА</p>
            <ul className="submenu">
              <li>
                <p>Обзор цикла</p>
                <p>Тренировочная нагрузка</p>
              </li>
            </ul>
          </li>
          <li className="down_help">
            <p>ПОМОЩЬ</p>
            <ul className="submenu">
              <li>
                <p>Инструкция</p>
                <p>Советы по выполнению</p>
              </li>
            </ul>
          </li>
        </div>
        <li className="out">
          <img src={logout} onClick={() => auth.logout()} alt="out" />
        </li>
      </ul>
    </nav>
  );
};
