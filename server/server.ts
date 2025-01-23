// Import necessary modules
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
const twilio = require('twilio');
const { VoiceResponse } = require("twilio").twiml;
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";


dotenv.config();
const AccessToken = twilio.jwt.AccessToken;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const port = 3000;

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;
const twimlAppSid = process.env.TWIML_APP_SID!; // Make sure this is defined
const apiKeySid = process.env.TWILIO_API_KEY_SID!;
const apiKeySecret = process.env.TWILIO_API_KEY_SECRET!;
const client = new twilio(accountSid, authToken);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//1: Get token
app.get("/get-token", async (req: Request, res: Response) => {
  try {
    const identity = req.query.identity as string;
    let voiceGrant;
    if (typeof process.env.TWIML_APP_SID !== "undefined") {      
      voiceGrant = new AccessToken.VoiceGrant({
        outgoingApplicationSid: process.env.TWIML_APP_SID,
        incomingAllow: true
      });
    } else {
      voiceGrant = new AccessToken.VoiceGrant({
        incomingAllow: true
      });
    }
      const token = new AccessToken(
      accountSid, // Use defined variables
      apiKeySid,
      apiKeySecret,
      { identity }
    );
  
    token.addGrant(voiceGrant);
    res.status(200).json({ success: true, token: token.toJwt() });
  } catch (error: any) {
    console.error("Error generating token:", error);
   res.status(500).json({ success: false, error: error.message });
  }
});

//2: Call the user
app.post("/voice", (req, res) => {
  const To = req.body.To;
  console.log("voice");
  const response = new VoiceResponse();
  const dial = response.dial({ callerId: process.env.TWILIO_PHONE_NUMBER,record: true, });
  dial.number(To);
  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

//3: Get incoming Calls
app.post("/voice/incoming", (req, res) => {
  console.log("voice/incoming");
  
  const response = new VoiceResponse();
  const dial = response.dial({ callerId: req.body.From, answerOnBridge: true ,record:true});
  dial.client(`ali`);
  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

//4: Send SMS
app.post("/send-sms", async (req: Request, res: Response) => {
  const { to, body } = req.body;
  try {
    const message = await client.messages.create({
      body,
      from: twilioPhoneNumber,
      to,
    });
    res.status(200).json({ success: true, messageSid: message.sid });
  } catch (error:any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//4: Recieve sms
app.post("/incoming-sms", (req: Request, res: Response) => {
  const { From, Body } = req.body; // Extract sender and message body
  console.log("From and Body",From , Body);
  
  io.emit("new-sms", { from: From, body: Body }); // Emit SMS data via WebSocket
  res.type("text/xml").send("<Response></Response>"); // Respond with TwiML
});




//Socket.IO connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


// Start server
httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


