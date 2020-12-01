import express from 'express'
import path from 'path'
import http from 'http'
import socketIO from 'socket.io'

//import socket connection
import socketConn from './sockets'

//init
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//settings
app.set('port', process.env.PORT || 3000);//creando puerto

//sockets
socketConn(io);

// static files
app.use(express.static(path.join(__dirname, 'public')));

//starting server
server.listen(app.get('port'), () => {
    console.log('Server in port', app.get('port'));
});
