import { Socket } from 'socket.io';

export const validateSocketConnection = (socket: Socket): boolean => {
    const { token, userPhone: phone } = socket.handshake.query;

    if (token !== 'COMPANY-001' || !phone || typeof phone !== 'string') {
        socket.disconnect();
        return false;
    }

    console.log('Connected:', token, phone);
    return true;
};