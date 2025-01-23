import React from "react";
import "../styles/KeypadButton.css";

const KeypadButton = ({ children, handleClick, color = "" }:any) => {
  return (
    <button className={`keypad-button ${color}`} onClick={handleClick}>
      {children}
    </button>
  );
};

export default KeypadButton;
