import React from "react";
import add from "../assets/images/3.svg";

export const AddButton = (props) => {
  return (
    <div class={"add " + props.className} onClick={props.onClick}>
      <img src={add} alt="add" />
    </div>
  );
};
