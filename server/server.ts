// Import necessary modules
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import twilio from 'twilio';

// Initialize the Express app and HTTP server
const app = express();
const server = http.createServer(app);
// const io = new SocketIOServer(server);
app.use(express.json());

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
