import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
export const Tools = (props) => {
  const auth = useContext(AuthContext);
  const [open, toggle] = useState(false);
  const handleDelete = () => {
    auth.setVisible(2);
  };
  const handleAccess = () => {
    auth.setVisible(1);
  };
  const handleLink = () => {
    auth.setVisible(3);
  };
  return (
    <div className="wraper_menu_tools">
      <div
        className={`gear ${open ? "rotate" : "unrotate"}`}
        onClick={() => toggle(!open)}
      ></div>
      <div className={`tools ${open ? "active" : "inactive"}`}>
        {props.visible[1] && (
          <div onClick={() => handleAccess()} className="access"></div>
        )}
        {props.visible[0] && (
          <div onClick={() => handleDelete()} className="delete"></div>
        )}
        {props.visible[2] && (
          <div onClick={() => handleLink()} className="link_tool"></div>
        )}
      </div>
    </div>
  );
};
