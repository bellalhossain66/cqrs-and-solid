"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const route_1 = __importDefault(require("./routes/route"));
const chat_socket_1 = require("./sockets/chat.socket");
dotenv_1.default.config({ quiet: true });
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        if (req.url.includes('widget.js')) {
            res.setHeader('Cache-Control', 'no-store');
        }
    }
    next();
});
app.use('/widget', express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/', route_1.default);
(0, chat_socket_1.RegisterChatSocket)(io);
const PORT = (process.env.SERVER_TYPE == 'local') ? process.env.APP_PORT : 8000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
