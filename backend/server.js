import express from 'express';
import dotenv, { config } from 'dotenv';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import http from 'http'
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/authRoutes.js';
import chatRouter from './routes/chatRoutes.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
const port = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));


// JSON middleware
app.use(express.json());


// Static uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve image

// routes
app.use('/api/auth',authRouter);
app.use('/api/chat',chatRouter);



// Socket.IO setup
const io = new Server(server,{
    cors : {
        origin: 'http://localhost:5173', // Allow frontend origin
        methods: ['GET', 'POST'], 
    }
});

// Socket.IO connection logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a specific chat room
  socket.on('join_chat', (roomId) => {
    socket.join(roomId);
  });

  // Handle sending message
  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', data);
  });


   socket.on('messageSeen', (data) => {
    io.to(data.roomId).emit('messageSeen', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


// connect server and database 
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('MongoDB Connected');
    server.listen(port, ()=>{
        console.log(`server is running on http://localhost:${port}`)
    });
}).catch((err)=>{
    console.log(err)
})
