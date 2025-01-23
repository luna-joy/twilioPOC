// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Device, Call } from "@twilio/voice-sdk";
import Dialler from "./Dialler";
import KeypadButton from "./KeypadButton";
import Incoming from "./Incoming";
import OnCall from "./OnCall";
import "../styles/Phone.css";
import states from "../helper/states";
import FakeState from "./FakeState";

const Phone = ({ token }: any) => {
  const [state, setState] = useState(states.CONNECTING);
  const [number, setNumber] = useState("");
  const [conn, setConnection] = useState(null);
  const [device, setDevice] = useState<Device | null>(null);


  useEffect(() => {
    if (!token) return;

    const initializeDevice = async () => {
      try {
        const twilioDevice = new Device(token, { allowIncomingWhileBusy: true, logLevel: 1,edge: "ashburn", });

        twilioDevice.register();
        setDevice(twilioDevice);
        twilioDevice.addListener("connect", (device) => {
          console.log("Connect event listener added .....");
          return device;
        });

        twilioDevice.on("registered", () => {
          console.log("Agent registered");
          setState(states.READY);
        });

        twilioDevice.on("connect", (connection) => {
          console.log("Call connect");
          setConnection(connection);
          setState(states.ON_CALL);
        });
        twilioDevice.on("disconnect", () => {
          console.log("Disconnect event");
          setState(states.READY);
          setConnection(null);
        });
        twilioDevice.on("incoming", connection => {
          console.log("incoming>>>>>",connection);
          setConnection(connection);
          setState(states.INCOMING);
          connection.on("reject", () => {
            console.log("Call rejected.");
            setState(states.READY);
            setConnection(null);
          });
        });

      } catch (error) {
        console.error('Error initializing Twilio Device:', error);
      }
    };

    initializeDevice();

    return () => {
      device?.destroy();
    };
  }, [token]);

  const handleCall = async () => {
    const params: Record<string, string> = { To: number };
    device?.emit("connect");
    device
      ?.connect({
        params: params,
        rtcConstraints: {
          audio: true,
        },
      })
      .then((call) => {
        call.on("accept", (connection) => {
          console.log(">>>>call accepted",connection);
          setConnection(connection);
          setState(states.ON_CALL); 
        });
        call.on("disconnect", () => {
          console.log(">>>>The call has been disconnected.");
          setState(states.READY);
          setConnection(null);
    
        });
        call.on("reject", () => {
          console.log(">>>>The call was rejected.");
          setConnection(null);
        });
      });
  };


  const handleHangup = () => {
    console.log("Its call");
    if (!device) return;
    setState(states.READY);
    setConnection(null);
    device.disconnectAll();
  };

  let render;
  if (conn) {
    if (state === states.INCOMING) {
      render = <Incoming device={device} connection={conn} handleHangup={handleHangup}></Incoming>;
    } else if (state === states.ON_CALL) {
      render = <OnCall handleHangup={handleHangup} connection={conn}></OnCall>;
    }
  } else {
    render = (
      <>
        <Dialler number={number} setNumber={setNumber}></Dialler>
        <div className="call">
          <KeypadButton handleClick={handleCall} color="green">
            Call
          </KeypadButton>
        </div>
      </>
    );
  }
  return (
    <>
      <FakeState
        currentState={state}
        setState={setState}
        setConn={setConnection}
      ></FakeState>
      {render}
      <p className="status">{state}</p>
    </>
  );
};

export default Phone;
