import React from "react";
import { NavLink } from "react-router-dom";
import logout from "../assets/images/logout2.svg";
import logo from "../assets/images/CyclesLogo.svg";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ConstructorContext } from "../../context/ConstructoContext";

export const Navbar = () => {
  const auth = useContext(AuthContext);
  const constructor = useContext(ConstructorContext);
  const handleHelp = (key) => {
    constructor.setHelp(key);
  };
  const handleCycle = (key) => {
    constructor.setCycle(key);
  };
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
            <p>ТИП</p>
            <ul className="submenu">
              <li>
                <p onClick={() => handleCycle(1)}>Линейный цикл</p>
                <p onClick={() => handleCycle(3)}>Тренировки в Excel</p>
                <p onClick={() => handleCycle(2)}>Недельная периодизация</p>
              </li>
            </ul>
          </li>
          <li className="down_help">
            <p>ПОМОЩЬ</p>
            <ul className="submenu">
              <li>
                <p onClick={() => handleHelp(1)}>Линейный цикл</p>
                <p onClick={() => handleCycle(3)}>Тренировки в Excel</p>
                <p onClick={() => handleHelp(2)}>Недельная периодизация</p>
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
