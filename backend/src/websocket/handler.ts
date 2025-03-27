import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';

interface SocketUser {
  userId: string;
  socketId: string;
}

const connectedUsers: SocketUser[] = [];

export const initializeWebSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      socket.data.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.userId);

    // Add user to connected users
    connectedUsers.push({
      userId: socket.data.userId,
      socketId: socket.id
    });

    // Join user's personal room
    socket.join(`user:${socket.data.userId}`);

    // Handle new message
    socket.on('send_message', async (data) => {
      try {
        const { recipientId, content } = data;

        const message = await prisma.message.create({
          data: {
            senderId: socket.data.userId,
            recipientId,
            content
          }
        });

        // Emit to recipient if online
        const recipientSocket = connectedUsers.find(
          (user) => user.userId === recipientId
        );

        if (recipientSocket) {
          io.to(recipientSocket.socketId).emit('receive_message', message);
        }

        // Emit back to sender
        socket.emit('message_sent', message);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    // Handle typing status
    socket.on('typing', (data) => {
      const { recipientId, isTyping } = data;

      const recipientSocket = connectedUsers.find(
        (user) => user.userId === recipientId
      );

      if (recipientSocket) {
        io.to(recipientSocket.socketId).emit('user_typing', {
          userId: socket.data.userId,
          isTyping
        });
      }
    });

    // Handle read receipts
    socket.on('mark_read', async (data) => {
      try {
        const { messageId } = data;

        await prisma.message.update({
          where: { id: messageId },
          data: { isRead: true }
        });

        // Notify sender that message was read
        const message = await prisma.message.findUnique({
          where: { id: messageId },
          include: { sender: true }
        });

        if (message) {
          const senderSocket = connectedUsers.find(
            (user) => user.userId === message.senderId
          );

          if (senderSocket) {
            io.to(senderSocket.socketId).emit('message_read', {
              messageId,
              readAt: new Date()
            });
          }
        }
      } catch (error) {
        console.error('Mark read error:', error);
        socket.emit('error', { message: 'Error marking message as read' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.userId);

      // Remove user from connected users
      const index = connectedUsers.findIndex(
        (user) => user.userId === socket.data.userId
      );
      if (index !== -1) {
        connectedUsers.splice(index, 1);
      }
    });
  });

  return io;
}; 