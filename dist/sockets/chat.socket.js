"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterChatSocket = void 0;
const sendmessage_handler_1 = require("../handlers/sendmessage.handler");
const chat_service_1 = require("../services/chat.service");
const message_repository_1 = require("../repositories/message.repository");
const sendmessage_command_1 = require("../commands/sendmessage.command");
const uuid_1 = require("uuid");
const RegisterChatSocket = (io) => {
    const repo = new message_repository_1.MySQLMessageRepository();
    const service = new chat_service_1.ChatService(repo);
    const handler = new sendmessage_handler_1.SendMessageHandler(service);
    io.on('connection', (socket) => {
        const { token, userPhone: phone } = socket.handshake.query;
        if (token !== 'COMPANY-001' || !phone || typeof phone !== 'string')
            return socket.disconnect();
        console.log(token, phone);
        socket.on('get_messages', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page = 1, limit = 20 }) {
            try {
                // const paginated = await GetAllUserMessage(phone, page, limit);
                // socket.emit('messages', paginated);
            }
            catch (err) {
                socket.emit('error', { message: 'Failed to load messages' });
            }
        }));
        socket.on('send_message', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const type = data.senderType;
            const userMessage = {
                senderPhone: (type === 'agent') ? '000000' : phone,
                senderType: type,
                content: data.message,
                senderId: 0,
                conversationId: (0, uuid_1.v4)(),
            };
            const { senderId, senderPhone, conversationId, content, senderType } = userMessage;
            console.log(data, userMessage);
            try {
                const command = new sendmessage_command_1.SendMessageCommand(senderId, senderPhone, conversationId, content, senderType);
                yield handler.handle(command);
                socket.emit('new_message', {
                    senderId,
                    senderPhone,
                    conversationId,
                    content,
                    senderType,
                    createdAt: new Date()
                });
            }
            catch (err) {
                socket.emit('error', { error: 'Message failed to send' });
            }
        }));
    });
};
exports.RegisterChatSocket = RegisterChatSocket;
