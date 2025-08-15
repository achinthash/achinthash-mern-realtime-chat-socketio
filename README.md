
# MERN Real-Time Chat App (Socket.IO)

  

A real-time chat application built with **MongoDB**, **Express.js**, **React**, **Node.js**, and **Socket.IO**.

Supports **private chat**, **group chat**, **online status**, and **file sharing** with separate **backend** and **frontend** projects.


---


##  Features

- Real-time messaging using **Socket.IO**

- Private & group chat support

- Online/offline user status indicator

- File sharing (images, documents.)

- Message timestamps

- MongoDB for storing chat history

---

 
## Tech Stack

**Frontend:** React, Axios, Socket.IO Client, Tailwind CSS 

**Backend:** Node.js, Express.js, MongoDB, Socket.IO, Multer (for file uploads)

**Database:** MongoDB 
  
---

  

##  Installation


### 1. Clone the repository

```bash

git  clone https://github.com/achinthash/achinthash-mern-realtime-chat-socketio.git

cd  mern-realtime-chat-app
```

### 2. Backend Setup

```bash 
cd backend

npm install
```

-   Create `uploads` file inside `backend` folder:
-   

-   Create `.env` file inside `backend` folder:
    
```bash 
PORT=8080
MONGO_URI=mongodb://localhost:27017/chat_app
JWT_SECRET=your_jwt_secret 
```

-   Start backend server:
   
`node server` 

Backend runs at: [http://localhost:8080](http://localhost:8080)


### 3. Frontend Setup

```bash 
cd frontend
npm install
```
-   Start frontend:
    
`npm run dev` 

Frontend runs at: [http://localhost:5173](http://localhost:5173)
