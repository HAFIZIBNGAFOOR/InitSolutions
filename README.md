# Real-Time Chat Application

This project is a real-time chat application built with Angular, ngx-socket-io, and Tailwind CSS. The application supports both group and individual chats with real-time messaging and file attachments.

## Features

- Real-time messaging
- Group and individual (private) chats
- File attachments
- Dynamic room creation and joining
- Authentication with JWT (JSON Web Token)
- User roles and route protection
- Accessible components using Tailwind CSS

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- Angular CLI installed globally
- A code editor (e.g., VSCode)

## Getting Started

### Backend (WebSocket Server)

1. Clone the repository:

    ```sh
    git clone https://github.com/your-repo/chat-app.git
    cd chat-app/server
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the WebSocket server:

    ```sh
    node server.js
    ```

The server will run on `http://localhost:3000`.

### Frontend (Angular Application)

1. Navigate to the frontend directory:

    ```sh
    cd ../frontend
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the Angular development server:

    ```sh
    ng serve
    ```

The application will be accessible at `http://localhost:4200`.

## Project Structure

- `server/`: Contains the WebSocket server code.
- `frontend/`: Contains the Angular application code.

## Components and Services

### AuthService

Handles authentication logic, including login, logout, and token management using JWT.

### ChatService

Manages WebSocket connections and handles sending/receiving messages and file attachments.

### ChatComponent

Displays and sends real-time chat messages. Supports group and individual chats with dynamic room creation and joining.

## Usage

1. **Create a Room:**

    - Enter a room name in the input field and click "Create Room".

2. **Join a Room:**

    - Select a room from the dropdown to join.

3. **Send a Message:**

    - Enter a message in the input field and click "Send".

4. **Send a File:**

    - Select a file using the file input and click "Send File".

## Example Code

### WebSocket Server (`server/server.js`)

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

const rooms = new Set();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('createRoom', (room) => {
    rooms.add(room);
    socket.join(room);
    io.emit('rooms', Array.from(rooms));
    console.log(`Room created: ${room}`);
  });

  socket.on('join', (room) => {
    if (rooms.has(room)) {
      socket.join(room);
      console.log(`Client joined room: ${room}`);
    }
  });

  socket.on('message', ({ room, message }) => {
    io.to(room).emit('message', { room, message });
  });

  socket.on('file', ({ room, file }) => {
    io.to(room).emit('file', { room, file });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
