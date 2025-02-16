/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { WalletService } from './wallet.service';
import { Types } from 'mongoose';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    createWallet(userId: string): Promise<Types.ObjectId>;
    creditWallet(userId: string, amount: number): Promise<void>;
    acceptOrder(orderId: string, erranderId: string): Promise<void>;
    markOrderAsDelivered(orderId: string): Promise<void>;
    getVendorTransactions(vendorId: string): Promise<import("../order/order.schema").Order[]>;
    getEranderOrders(erranderId: string): Promise<import("../order/order.schema").Order[]>;
    getWalletProfile(userId: string): Promise<import("./wallet.schema").WalletDocument>;
}
