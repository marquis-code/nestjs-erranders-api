// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Chat, ChatDocument } from './chat.schema'; // Updated to use your schema
// import { defaultApp } from '../auth/firebaseAdmin';
// import * as firebase from 'firebase-admin';

// @Injectable()
// export class ChatService {
//   constructor(
//     @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
//   ) {}

//   private allUsers: Array<{ userName: string; registrationToken: string }> = [];
//   private connectedUsers: string[] = [];

//   // Fetch all chats
//   async getChats(): Promise<Chat[]> {
//     return this.chatModel.find().exec();
//   }

//   // Save a new chat
//   async saveChat(chat: Partial<Chat>): Promise<void> {
//     const createdChat = new this.chatModel(chat);
//     await createdChat.save();
//   }

//   // Handle user connection
//   userConnected(userName: string, registrationToken: string): void {
//     const existingUser = this.allUsers.find((u) => u.userName === userName);

//     if (!existingUser) {
//       this.allUsers.push({ userName, registrationToken });
//     } else {
//       existingUser.registrationToken = registrationToken;
//     }

//     if (!this.connectedUsers.includes(userName)) {
//       this.connectedUsers.push(userName);
//     }

//     console.log('All Users:', this.allUsers);
//     console.log('Connected Users:', this.connectedUsers);
//   }

//   // Handle user disconnection
//   userDisconnected(userName: string): void {
//     this.connectedUsers = this.connectedUsers.filter((u) => u !== userName);
//     console.log('All Users:', this.allUsers);
//     console.log('Connected Users:', this.connectedUsers);
//   }

//   // Send notifications to offline users
// //   async sendMessagesToOfflineUsers(chat: Partial<Chat>): Promise<void> {
// //     const messagePayload = {
// //       data: {
// //         type: 'CHAT',
// //         title: 'New Message',
// //         message: chat.message || '',
// //         sender: chat.sender || '',
// //         recipient: chat.recipient || '',
// //         time: chat.time || '',
// //       },
// //       tokens: [],
// //     };

// //     const userTokens = this.allUsers
// //       .filter((user) => !this.connectedUsers.includes(user.userName))
// //       .map((user) => user.registrationToken);

// //     if (userTokens.length === 0) {
// //       return;
// //     }

// //     messagePayload.tokens = userTokens;

// //     try {
// //       await defaultApp.messaging().sendMulticast(messagePayload);
// //     } catch (error) {
// //       console.error('Error sending notifications:', error);
// //     }
// //   }
// // async sendMessagesToOfflineUsers(chat: Partial<Chat>): Promise<void> {
// //     const messagePayload = {
// //       data: {
// //         type: 'CHAT',
// //         title: 'New Message',
// //         message: chat.message || '',
// //         sender: chat.sender || '',
// //         recipient: chat.recipient || '',
// //         time: chat.time || '',
// //       },
// //       tokens: [], // Tokens will be added here
// //     };
  
// //     const userTokens = this.allUsers
// //       .filter((user) => !this.connectedUsers.includes(user.userName))
// //       .map((user) => user.registrationToken);
  
// //     if (userTokens.length === 0) {
// //       return;
// //     }
  
// //     messagePayload.tokens = userTokens;
  
// //     try {
// //       const response = await defaultApp.messaging().sendMulticast(messagePayload);
// //       console.log('Successfully sent messages:', response.successCount);
// //     } catch (error) {
// //       console.error('Error sending notifications:', error);
// //     }
// //   }

// async sendMessagesToOfflineUsers(chat: Partial<Chat>): Promise<void> {
//   const messagePayload = {
//     notification: {
//       title: 'New Message',
//       body: chat.message || 'You have a new message!',
//     },
//     data: {
//       type: 'CHAT',
//       sender: chat.sender || '',
//       recipient: chat.recipient || '',
//       time: chat.time || '',
//     },
//     tokens: [], // Tokens will be added here
//   };

//   // Collect tokens of offline users
//   const userTokens = this.allUsers
//     .filter((user) => !this.connectedUsers.includes(user.userName))
//     .map((user) => user.registrationToken);

//   if (userTokens.length === 0) {
//     console.log('No offline users to notify.');
//     return;
//   }

//   messagePayload.tokens = userTokens;

//   try {
//     // Use Firebase Admin's sendMulticast method
//     const response = await defaultApp.messaging().sendMulticast(messagePayload);
//     console.log(`Successfully sent messages: ${response.successCount}`);
//     if (response.failureCount > 0) {
//       console.log(`Failed to send messages: ${response.failureCount}`);
//       response.responses.forEach((resp, idx) => {
//         if (!resp.success) {
//           console.error(`Failed message to token ${userTokens[idx]}: ${resp.error}`);
//         }
//       });
//     }
//   } catch (error) {
//     console.error('Error sending notifications:', error);
//   }
// }

  
// }

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './chat.schema';
import { defaultApp } from '../auth/firebaseAdmin';
import * as firebase from 'firebase-admin';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  ) {}

  private allUsers: Array<{ userName: string; registrationToken: string }> = [];
  private connectedUsers: string[] = [];

  async getChats(): Promise<Chat[]> {
    return this.chatModel.find().exec();
  }

  async saveChat(chat: Partial<Chat>): Promise<void> {
    const createdChat = new this.chatModel(chat);
    await createdChat.save();
  }

  userConnected(userName: string, registrationToken: string): void {
    const existingUser = this.allUsers.find((u) => u.userName === userName);

    if (!existingUser) {
      this.allUsers.push({ userName, registrationToken });
    } else {
      existingUser.registrationToken = registrationToken;
    }

    if (!this.connectedUsers.includes(userName)) {
      this.connectedUsers.push(userName);
    }

    console.log('All Users:', this.allUsers);
    console.log('Connected Users:', this.connectedUsers);
  }

  userDisconnected(userName: string): void {
    this.connectedUsers = this.connectedUsers.filter((u) => u !== userName);
    console.log('All Users:', this.allUsers);
    console.log('Connected Users:', this.connectedUsers);
  }

  async sendMessagesToOfflineUsers(chat: Partial<Chat>): Promise<void> {
    // Get tokens of offline users
    const userTokens = this.allUsers
      .filter((user) => !this.connectedUsers.includes(user.userName))
      .map((user) => user.registrationToken);

    if (userTokens.length === 0) {
      console.log('No offline users to notify.');
      return;
    }

    const message: firebase.messaging.MulticastMessage = {
      notification: {
        title: 'New Message',
        body: chat.message || 'You have a new message!',
      },
      data: {
        type: 'CHAT',
        sender: chat.sender || '',
        recipient: chat.recipient || '',
        time: chat.time || '',
      },
      tokens: userTokens,
    };

    try {
      const response = await firebase.messaging().sendEachForMulticast(message);
      console.log(`Successfully sent messages: ${response.successCount}`);
      if (response.failureCount > 0) {
        console.log(`Failed to send messages: ${response.failureCount}`);
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.error(`Failed message to token ${userTokens[idx]}: ${resp.error}`);
          }
        });
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  }
}