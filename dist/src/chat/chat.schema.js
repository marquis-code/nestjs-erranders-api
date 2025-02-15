"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSchema = exports.Chat = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Chat = class Chat {
    constructor(chat) {
        Object.assign(this, chat);
    }
};
exports.Chat = Chat;
__decorate([
    (0, mongoose_1.Prop)({
        required: [true, 'Message is required'],
    }),
    __metadata("design:type", String)
], Chat.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: [true, 'Sender is required'],
    }),
    __metadata("design:type", String)
], Chat.prototype, "sender", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: [true, 'Recipient is required'],
    }),
    __metadata("design:type", String)
], Chat.prototype, "recipient", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: [true, 'Time is required'],
    }),
    __metadata("design:type", String)
], Chat.prototype, "time", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: String }],
        default: [],
    }),
    __metadata("design:type", Array)
], Chat.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                filename: String,
                url: String,
                mimeType: String,
                size: Number,
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Chat.prototype, "files", void 0);
exports.Chat = Chat = __decorate([
    (0, mongoose_1.Schema)(),
    __metadata("design:paramtypes", [Object])
], Chat);
exports.ChatSchema = mongoose_1.SchemaFactory.createForClass(Chat);
//# sourceMappingURL=chat.schema.js.map