import React, { useState } from "react";
import KeypadButton from "./KeypadButton";
import useLoudness from "../hooks/useLoudness";
import useMuteWarning from "../hooks/useMuteWarning";
import "../styles/OnCall.css";
import Timer from "./Timer";

interface OnCallProps {
  handleHangup: () => void;
  connection: {
    mute: (muteState: boolean) => void; 
  };
}

const OnCall: React.FC<OnCallProps> = ({ handleHangup, connection }) => {
  const [muted, setMuted] = useState<boolean>(false);
  const [running, setRunning, loudness] = useLoudness();
  const [showMuteWarning] = useMuteWarning(loudness, running);

  const handleMute = () => {
    connection.mute(!muted); // If the connection object supports muting, you can uncomment this line
    setMuted(!muted);
    setRunning(!muted);
  };

  const muteWarning = (
    <p className="warning">Are you speaking? You are on mute!</p>
  );

  return (
    <>
      {showMuteWarning && muteWarning}
  <div style={{margin:'20px'}}>
  <Timer/>
  </div>
      <div style={{display:'flex',width:'100%',margin:'20px',alignItems:"center",justifyContent:'center',gap:20}}>
        
        <div className="">
          <KeypadButton  handleClick={handleMute} color={muted ? "red" : ""}>
            {muted ? "Unmute" : "Mute"}
          </KeypadButton>
        </div>
        <div className="hang-up">
          <KeypadButton handleClick={handleHangup} color="red">
            Hang up
          </KeypadButton>
        </div>
      </div>
    </>
  );
};

export default OnCall;
