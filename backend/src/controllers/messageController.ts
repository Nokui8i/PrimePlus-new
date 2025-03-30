import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user?.id;

    const message = await prisma.message.create({
      data: {
        content,
        sender: { connect: { id: senderId } },
        receiver: { connect: { id: receiverId } }
      } as Prisma.MessageCreateInput,
      include: {
        sender: true,
        receiver: true
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Error sending message' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { otherUserId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [
              { senderId: userId },
              { receiverId: otherUserId }
            ]
          },
          {
            AND: [
              { senderId: otherUserId },
              { receiverId: userId }
            ]
          }
        ]
      } as Prisma.MessageWhereInput,
      include: {
        sender: true,
        receiver: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      } as Prisma.MessageWhereInput,
      include: {
        sender: true,
        receiver: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      distinct: ['senderId', 'receiverId']
    });

    // Group messages by conversation
    const groupedConversations = conversations.reduce((acc, message) => {
      const otherUser = message.senderId === userId ? message.receiver : message.sender;
      if (!acc[otherUser.id]) {
        acc[otherUser.id] = {
          user: otherUser,
          lastMessage: message
        };
      }
      return acc;
    }, {} as Record<string, { user: any; lastMessage: any }>);

    res.json(Object.values(groupedConversations));
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Error fetching conversations' });
  }
}; 