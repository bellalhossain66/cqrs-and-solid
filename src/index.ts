import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import healthRoute from './routes/route';
import { RegisterChatSocket } from './sockets';

dotenv.config({ quiet: true });
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        if (req.url.includes('widget.js')) {
            res.setHeader('Cache-Control', 'no-store');
        }
    }
    next();
});

app.use('/widget', express.static(path.join(__dirname, '../public')));
app.use('/widgetAgent', express.static(path.join(__dirname, '../public')));
app.use('/', healthRoute);

RegisterChatSocket(io);

const PORT = (process.env.SERVER_TYPE == 'local') ? process.env.APP_PORT : 8000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});