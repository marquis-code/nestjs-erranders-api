import { ChatService } from './chat.service';
import { Chat } from './chat.schema';
import { Socket } from 'socket.io';
export declare class ChatGateway {
    private readonly chatService;
    server: any;
    constructor(chatService: ChatService);
    afterInit(server: any): void;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
    handleNewMessage(chat: Chat, sender: Socket): Promise<void>;
}
