"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageCommand = void 0;
class SendMessageCommand {
    constructor(senderId, senderPhone, conversationId, content, senderType) {
        this.senderId = senderId;
        this.senderPhone = senderPhone;
        this.conversationId = conversationId;
        this.content = content;
        this.senderType = senderType;
    }
}
exports.SendMessageCommand = SendMessageCommand;
