import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import './App.css'; // Assuming you'll use external CSS file for better style management
import { Device } from '@twilio/voice-sdk';
import Phone from "./components/Phone";


// Initialize Socket.IO client
const socket = io("http://localhost:3000");

const App: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [messageUrl, setMessageUrl] = useState("");
  const [response, setResponse] = useState("");
  const [chatHistory, setChatHistory] = useState<Map<string, { from: string; body: string }[]>>(new Map());
  const [token, setToken] = useState<string>("");
  const [clicked, setClicked] = useState(false);

  const init = async () => {
    const { data } = await axios.get("http://localhost:3000/get-token", {
      params: { identity: "ali" },
      // params: { identity: 'user-' + Math.random().toString(36).substring(7) },
    });
    console.log("Data.token",data.token);
    
    setToken(data.token);
  };
  const handleClick = () => {
    setClicked(true);
    init()
  };



  const handleSendSMS = async () => {
    try {
      const res = await axios.post("http://localhost:3000/send-sms", {
        to: phoneNumber,
        body: message,
      });
      setResponse(`SMS sent! Message SID: ${res.data.messageSid}`);
      updateChatHistory(phoneNumber, "Me", message);
      setMessage(""); // Clear message input after sending
    } catch (error: any) {
      setResponse(`Error: ${error.response?.data?.error || error.message}`);
    }
  };



  const updateChatHistory = (phone: string, from: string, body: string) => {
    setChatHistory((prevHistory) => {
      const newHistory = new Map(prevHistory);
      const currentChat = newHistory.get(phone) || [];
      
  
      const messageExists = currentChat.some((msg) => msg.body === body && msg.from === from);
      if (!messageExists) {
        
        currentChat.push({ from, body });
        newHistory.set(phone, currentChat);
      }
      
      return newHistory;
    });
  };
  

  useEffect(() => {
 

    socket.on("new-sms", (data: { from: string; body: string }) => {
      updateChatHistory(data.from, data.from, data.body);
    });

    return () => {
  
      socket.off("new-sms");
    };
  }, []);
  

  return (
    <div className="app">
   <h1 className="header">Welcome Twilio SMS & Call</h1>
    <main>
      {!clicked && <button style={{padding:10}} onClick={handleClick}>Register your app For calling</button>}

      {token ? <Phone token={token}></Phone> : (
         <div className="app-container">
    
     

      <div className="form-container">
        <div className="input-field">
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Recipient's phone number"
          />
        </div>

        <div className="input-field">
          <label>SMS Message:</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message"
          />
        </div>

        <div className="button-group">
          <button onClick={handleSendSMS}>Send SMS</button>
        </div>
      </div>

      <div className="chat-history-container">
        <h2>Chat History</h2>
        {Array.from(chatHistory.keys()).map((phone) => (
          <div key={phone} className="chat-history">
            <h3>Chat with {phone}</h3>
            <div className="chat-bubbles">
              {chatHistory.get(phone)?.map((msg, index) => (
                <div key={index} className={msg.from === "Me" ? "outgoing-bubble" : "incoming-bubble"}>
                  <strong>{msg.from}: </strong>{msg.body}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div> 
     </div>

      )}
    </main>

  </div>

      );
};

export default App;
