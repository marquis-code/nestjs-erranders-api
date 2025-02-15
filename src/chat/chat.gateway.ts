// import {
//     ConnectedSocket,
//     MessageBody,
//     SubscribeMessage,
//     WebSocketGateway,
//   } from '@nestjs/websockets';
//   import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
//   import { ChatService } from './chat.service';
//   import { Bind, UseInterceptors } from '@nestjs/common';
//   import { Chat } from './chat.entity';
  
//   @WebSocketGateway()
//   export class ChatGateway implements NestGateway {
//     constructor(private chatService: ChatService) { }
  
//     afterInit(server: any) {
//       // console.log('Init', server);
//     }
  
//     handleConnection(socket: any) {
//       const query = socket.handshake.query;
//       console.log('Connect', query);
//       this.chatService.userConnected(query.userName, query.registrationToken);
//       process.nextTick(async () => {
//         socket.emit('allChats', await this.chatService.getChats());
//       });
//     }
  
//     handleDisconnect(socket: any) {
//       const query = socket.handshake.query;
//       console.log('Disconnect', socket.handshake.query);
//       this.chatService.userDisconnected(query.userName);
//     }
  
//     @Bind(MessageBody(), ConnectedSocket())
//     @SubscribeMessage('chat')
//     async handleNewMessage(chat: Chat, sender: any) {
//       console.log('New Chat', chat);
//       await this.chatService.saveChat(chat);
//       sender.emit('newChat', chat);
//       sender.broadcast.emit('newChat', chat);
//       await this.chatService.sendMessagesToOfflineUsers(chat);
//     }
//   }

import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { ChatService } from './chat.service';
  import { Chat } from './chat.schema'; // Use the Mongoose schema
  import { Socket } from 'socket.io';
  
  @WebSocketGateway()
  export class ChatGateway {
    @WebSocketServer() server: any; // Access the WebSocket server instance
  
    constructor(private readonly chatService: ChatService) {}
  
    afterInit(server: any) {
      console.log('WebSocket Gateway Initialized');
    }
  
    handleConnection(socket: Socket) {
      const { userName, registrationToken } = socket.handshake.query as Record<
        string,
        string
      >;
      console.log('User connected:', userName);
  
      // Register the connected user
      this.chatService.userConnected(userName, registrationToken);
  
      // Emit all chats to the connected user after registration
      process.nextTick(async () => {
        const chats = await this.chatService.getChats();
        socket.emit('allChats', chats);
      });
    }
  
    handleDisconnect(socket: Socket) {
      const { userName } = socket.handshake.query as Record<string, string>;
      console.log('User disconnected:', userName);
  
      // Remove the user from the connected list
      this.chatService.userDisconnected(userName);
    }
  
    @SubscribeMessage('chat')
    async handleNewMessage(
      @MessageBody() chat: Chat,
      @ConnectedSocket() sender: Socket,
    ) {
      console.log('New chat received:', chat);
  
      // Save the chat to the database
      await this.chatService.saveChat(chat);
  
      // Emit the new chat to the sender
      sender.emit('newChat', chat);
  
      // Broadcast the chat to all other connected clients
      sender.broadcast.emit('newChat', chat);
  
      // Notify offline users about the new message
      await this.chatService.sendMessagesToOfflineUsers(chat);
    }
  }
  