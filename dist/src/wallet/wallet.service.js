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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const wallet_schema_1 = require("./wallet.schema");
const order_schema_1 = require("../order/order.schema");
let WalletService = class WalletService {
    constructor(walletModel, orderModel, connection) {
        this.walletModel = walletModel;
        this.orderModel = orderModel;
        this.connection = connection;
    }
    async createWallet(userId) {
        const newWallet = new this.walletModel({ userId, balance: 0, transactions: [] });
        const savedWallet = await newWallet.save();
        return savedWallet._id;
    }
    async creditWallet(userId, amount, transaction) {
        const updateQuery = { $inc: { balance: amount } };
        if (transaction) {
            updateQuery.$push = { transactions: transaction };
        }
        await this.walletModel.updateOne({ userId }, updateQuery);
    }
    async getWalletProfile(userId) {
        return this.walletModel.findOne({ userId }).exec();
    }
    async updateWallets(erranderId, erranderShare, vendorShares, businessShare) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            if (erranderId) {
                await this.creditWallet(erranderId.toString(), erranderShare, {
                    type: 'earnings',
                    amount: erranderShare,
                    description: 'Earnings from order delivery',
                    date: new Date()
                });
            }
            for (const { vendorId, amount } of vendorShares) {
                await this.creditWallet(vendorId.toString(), amount, {
                    type: 'earnings',
                    amount: amount,
                    description: 'Earnings from sold products',
                    date: new Date()
                });
            }
            await this.creditWallet('business_wallet', businessShare, {
                type: 'commission',
                amount: businessShare,
                description: 'Business commission from order',
                date: new Date()
            });
            await session.commitTransaction();
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async handleOrderCompletion(orderId) {
        var _a;
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const order = await this.orderModel.findById(orderId).exec();
            if (order && order.status === 'delivered') {
                const erranderShare = order.erranderId ? order.totalPrice * 0.2 : 0;
                const businessShare = order.totalPrice * 0.1;
                const vendorShares = order.items.map(item => ({
                    vendorId: item.vendorId.toString(),
                    amount: item.price * 0.7,
                }));
                await this.updateWallets((_a = order.erranderId) === null || _a === void 0 ? void 0 : _a.toString(), erranderShare, vendorShares, businessShare);
            }
            await session.commitTransaction();
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async acceptOrder(orderId, erranderId) {
        await this.orderModel.updateOne({ _id: orderId }, { $set: { erranderId, status: 'accepted' } });
    }
    async markOrderAsDelivered(orderId) {
        await this.orderModel.updateOne({ _id: orderId }, { $set: { status: 'delivered' } });
        await this.handleOrderCompletion(orderId);
    }
    async getTransactionsForVendor(vendorId) {
        return this.orderModel.find({ 'items.vendorId': vendorId, status: 'delivered' }).exec();
    }
    async getOrdersForErrander(erranderId) {
        return this.orderModel.find({ erranderId }).populate('items.product user').exec();
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(wallet_schema_1.Wallet.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(2, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Connection])
], WalletService);
//# sourceMappingURL=wallet.service.js.map