"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_schema_1 = require("./chat.schema");
const firebase = __importStar(require("firebase-admin"));
let ChatService = class ChatService {
    constructor(chatModel) {
        this.chatModel = chatModel;
        this.allUsers = [];
        this.connectedUsers = [];
    }
    async getChats() {
        return this.chatModel.find().exec();
    }
    async saveChat(chat) {
        const createdChat = new this.chatModel(chat);
        await createdChat.save();
    }
    userConnected(userName, registrationToken) {
        const existingUser = this.allUsers.find((u) => u.userName === userName);
        if (!existingUser) {
            this.allUsers.push({ userName, registrationToken });
        }
        else {
            existingUser.registrationToken = registrationToken;
        }
        if (!this.connectedUsers.includes(userName)) {
            this.connectedUsers.push(userName);
        }
        console.log('All Users:', this.allUsers);
        console.log('Connected Users:', this.connectedUsers);
    }
    userDisconnected(userName) {
        this.connectedUsers = this.connectedUsers.filter((u) => u !== userName);
        console.log('All Users:', this.allUsers);
        console.log('Connected Users:', this.connectedUsers);
    }
    async sendMessagesToOfflineUsers(chat) {
        const userTokens = this.allUsers
            .filter((user) => !this.connectedUsers.includes(user.userName))
            .map((user) => user.registrationToken);
        if (userTokens.length === 0) {
            console.log('No offline users to notify.');
            return;
        }
        const message = {
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
        }
        catch (error) {
            console.error('Error sending notifications:', error);
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_schema_1.Chat.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map