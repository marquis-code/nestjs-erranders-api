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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const common_1 = require("@nestjs/common");
const wallet_service_1 = require("./wallet.service");
let WalletController = class WalletController {
    constructor(walletService) {
        this.walletService = walletService;
    }
    async createWallet(userId) {
        return this.walletService.createWallet(userId);
    }
    async creditWallet(userId, amount) {
        await this.walletService.creditWallet(userId, amount);
    }
    async acceptOrder(orderId, erranderId) {
        await this.walletService.acceptOrder(orderId, erranderId);
    }
    async markOrderAsDelivered(orderId) {
        await this.walletService.markOrderAsDelivered(orderId);
    }
    async getVendorTransactions(vendorId) {
        return this.walletService.getTransactionsForVendor(vendorId);
    }
    async getEranderOrders(erranderId) {
        return this.walletService.getOrdersForErrander(erranderId);
    }
    async getWalletProfile(userId) {
        const wallet = await this.walletService.getWalletProfile(userId);
        if (!wallet) {
            throw new common_1.NotFoundException('Wallet not found');
        }
        return wallet;
    }
};
exports.WalletController = WalletController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "createWallet", null);
__decorate([
    (0, common_1.Post)(':userId/credit'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "creditWallet", null);
__decorate([
    (0, common_1.Put)('orders/:orderId/accept'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)('erranderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "acceptOrder", null);
__decorate([
    (0, common_1.Put)('orders/:orderId/deliver'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "markOrderAsDelivered", null);
__decorate([
    (0, common_1.Get)('vendors/:vendorId/transactions'),
    __param(0, (0, common_1.Param)('vendorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getVendorTransactions", null);
__decorate([
    (0, common_1.Get)('erranders/:erranderId/orders'),
    __param(0, (0, common_1.Param)('erranderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getEranderOrders", null);
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getWalletProfile", null);
exports.WalletController = WalletController = __decorate([
    (0, common_1.Controller)('wallets'),
    __metadata("design:paramtypes", [wallet_service_1.WalletService])
], WalletController);
//# sourceMappingURL=wallet.controller.js.map