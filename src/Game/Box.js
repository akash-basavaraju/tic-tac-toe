import React from "react";
import "./Box.css";

function Box(props) {
  const { value = "", onClick = () => {}, index } = props;

  return (
    <div
      className="box_container"
      onClick={() => {
        if (value === -1) {
          onClick(index);
        }
      }}
    >
      {value === -1 ? " " : value === 0 ? "O" : "X"}
    </div>
  );
}

export default Box;
