import dotenv from 'dotenv';
import express from "express";
import { WebSocketServer, WebSocket } from 'ws';
import configure from '../routers/index.ts';

dotenv.config();

// const serverIP = '192.168.10.50';
// const serverPort = 81;
const serverIP = '0.0.0.0';

const port: string | number = process.env.PORT || 3000;

const app = express();
configure(app);

console.log(`Attempting to run server on port ${port}`);

// const server = app.listen(serverPort, serverIP, () => {
//     console.log(`Server running at http://${serverIP}:${serverPort}/`);
// }).on('error', (err) => {
//     console.error('Server failed to start:', err);
// });

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
}).on('error', (err: Error) => {
    console.error('Server failed to start:', err);
});

function onSocketPreError(e: Error) {
    console.log(e);
}

function onSocketPostError(e: Error) {
    console.log(e);
}

const wss = new WebSocketServer({ noServer: true }); // upgrade manually

server.on('upgrade', (req, socket, head) => {
    socket.on('error', onSocketPreError);

    // perform auth
    if (!!req.headers['BadAuth']) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
        socket.removeListener('error', onSocketPreError);
        console.log('server upgraded');
        wss.emit('connection', ws, req);
    });
});

wss.on('connection', (ws, req) => {
    ws.on('error', onSocketPostError);
    
    console.log('Connection established');

    ws.on('message', (msg, isBinary) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg, { binary: isBinary });
            }
        });
        console.log("msg received");
    });

    ws.on('close', () => {
        console.log('Connection closed');
    });
});