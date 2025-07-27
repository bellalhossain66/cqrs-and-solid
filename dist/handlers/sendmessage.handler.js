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
exports.SendMessageHandler = void 0;
class SendMessageHandler {
    constructor(chatService) {
        this.chatService = chatService;
    }
    handle(command) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chatService.sendMessage(command.senderId, command.senderPhone, command.conversationId, command.content, command.senderType);
        });
    }
}
exports.SendMessageHandler = SendMessageHandler;
