import React, { useState } from "react";

const Incoming = ({ connection, device ,handleHangup }:any) => {
  
  const acceptConnection = () => {
    connection.accept();
  };
  const rejectConnection = () => {

    handleHangup()
    connection.reject()
    device.disconnectAll();
  };
  
  return (
    <div style={{display:'flex',width:'100%', flexDirection:'row',gap:10,alignItems:'center',justifyContent:"center",margin:20}}>

      <button onClick={acceptConnection} style={{padding:10,backgroundColor:'green'}}>Accept</button>
      <button onClick={rejectConnection} style={{padding:10,backgroundColor:'red'}}>Reject</button>


    </div>
  );
};

export default Incoming;
