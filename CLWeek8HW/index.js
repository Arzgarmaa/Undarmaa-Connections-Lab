const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

//adding inline comments to understand the code better

// Initialize Socket.IO with a 5MB buffer limit to support large base64 image data URLs
const io = new Server(server, { maxHttpBufferSize: 5e6 });

// Serve static frontend files from the 'public' folder
app.use(express.static('public'));

// In-memory stores for canvas drawing history and custom pen shapes
let history = [];
let shapes = [];

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send initial canvas state to newly connected client
  socket.emit('init', { history, shapes });

  // Relay live drawing strokes/stamps to all other connected clients
  socket.on('draw', (d) => {
    history.push(d);
    socket.broadcast.emit('draw', d);
  });

  // Broadcast new custom pen shapes (e.g., hearts/drawn icons) to all clients
  socket.on('saveShape', (s) => {
    shapes.push(s);
    io.emit('shapeSaved', s);
  });

  // Clear canvas history for all connected clients
  socket.on('clear', () => {
    history = [];
    io.emit('clear');
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});