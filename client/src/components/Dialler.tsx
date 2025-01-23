import React from "react";
import "../styles/Dialler.css";
import KeypadButton from "./KeypadButton";

interface DiallerProps {
  number: string;
  setNumber: (newNumber: string) => void;
}

const Dialler: React.FC<DiallerProps> = ({ number, setNumber }) => {
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(event.target.value);
  };

  const handleBackSpace = () => {
    setNumber(number.substring(0, number.length - 1));
  };

  const handleNumberPressed = (newNumber: string) => {
    return () => {
      setNumber(`${number}${newNumber}`);
    };
  };

  return (
    <>
      <input
        type="tel"
        value={number}
        onChange={handleNumberChange}
     
        placeholder="Please enter phone number"
        className="input "
      
      />
      <ol className="keypad">
        <li>
          <KeypadButton handleClick={handleNumberPressed("1")}>1</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed("2")}>2</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed("3")}>3</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed("4")}>4</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed("5")}>5</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed("6")}>6</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed("7")}>7</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed("8")}>8</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed("9")}>9</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed("+")}>+</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed("0")}>0</KeypadButton>
        </li>
        {number.length > 0 && (
          <li>
            <KeypadButton handleClick={handleBackSpace}>&lt;&lt;</KeypadButton>
          </li>
        )}
      </ol>
 
    </>
  );
};

export default Dialler;
