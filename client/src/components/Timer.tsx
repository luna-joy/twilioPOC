import { useEffect, useState } from "react";

const Timer = () => {
    const [timer, setTimer] = useState({ mins: 0, sec: 0 });
    const getTime = () => {
      setTimer((state) => ({
        mins: state.sec === 60 ? state.mins + 1 : state.mins,
        sec: state.sec === 60 ? 0 : state.sec + 1,
      }));
    };
    useEffect(() => {
      const interval = setInterval(() => getTime(), 1000);
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className="timer">
        {`${timer.mins < 9 ? "0" + timer.mins : timer.mins} : ${
          timer.sec < 9 ? "0" + timer.sec : timer.sec
        }`}
      </div>
    );
  };

  export default Timer