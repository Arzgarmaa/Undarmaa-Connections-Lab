const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 5e6 });

app.use(express.static('public'));

let history = [];
let shapes = [];

io.on('connection', (socket) => {
  socket.emit('init', { history, shapes });

  socket.on('draw', (d) => {
    history.push(d);
    socket.broadcast.emit('draw', d);
  });

  socket.on('saveShape', (s) => {
    shapes.push(s);
    io.emit('shapeSaved', s);
  });

  socket.on('clear', () => {
    history = [];
    io.emit('clear');
  });
});

server.listen(3000, () => console.log('listening at http://localhost:3000'));