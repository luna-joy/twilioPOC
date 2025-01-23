import React from "react";
import states from "../helper/states";
import "../styles/FakeState.css";

interface States {
  READY: string;
  CONNECTING: string;
  INCOMING: string;
  ON_CALL: string;
  OFFLINE: string;
}

interface FakeStateProps {
  currentState: string; // Adjust if `states` values have specific types
  setState: (state: string) => void;
  setConn: (conn: boolean | null) => void;
}

const FakeState: React.FC<FakeStateProps> = ({ currentState, setState, setConn }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const stateKey = event.target.value as keyof States; // Assert that the value is a key of the `states` object
    const newState = states[stateKey];
    setState(newState);
    if (newState === states.INCOMING || newState === states.ON_CALL) {
      setConn(true);
    } else {
      setConn(null);
    }
  };

  const checkboxes = Object.keys(states).map((stateKey) => {
    return (
      <React.Fragment key={stateKey}>
        <label htmlFor={stateKey}>{states[stateKey as keyof States]}</label>
        <input
          type="radio"
          name="fake-state"
          value={stateKey}
          id={stateKey}
          checked={currentState === states[stateKey as keyof States]}
          onChange={handleChange}
        />
      </React.Fragment>
    );
  });

  return <div className="fake-state">{checkboxes}</div>;
};

export default FakeState;
