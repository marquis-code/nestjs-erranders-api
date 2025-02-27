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
import { Document, Types } from "mongoose";
import { Product } from "../product/product.schema";
export type OrderDocument = Order & Document;
declare class OrderItem {
    product: Product;
    quantity: number;
    vendorId: string;
    price: number;
}
export declare const OrderItemSchema: import("mongoose").Schema<OrderItem, import("mongoose").Model<OrderItem, any, any, any, Document<unknown, any, OrderItem> & OrderItem & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrderItem, Document<unknown, {}, import("mongoose").FlatRecord<OrderItem>> & import("mongoose").FlatRecord<OrderItem> & {
    _id: Types.ObjectId;
}>;
declare class PaymentDetails {
    transactionId: string;
    paymentMethod: string;
    paymentDate: Date;
}
export declare const PaymentDetailsSchema: import("mongoose").Schema<PaymentDetails, import("mongoose").Model<PaymentDetails, any, any, any, Document<unknown, any, PaymentDetails> & PaymentDetails & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PaymentDetails, Document<unknown, {}, import("mongoose").FlatRecord<PaymentDetails>> & import("mongoose").FlatRecord<PaymentDetails> & {
    _id: Types.ObjectId;
}>;
declare class WalletDistribution {
    erranderWallet: number;
    vendorWallet: number;
    businessWallet: number;
}
export declare const WalletDistributionSchema: import("mongoose").Schema<WalletDistribution, import("mongoose").Model<WalletDistribution, any, any, any, Document<unknown, any, WalletDistribution> & WalletDistribution & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WalletDistribution, Document<unknown, {}, import("mongoose").FlatRecord<WalletDistribution>> & import("mongoose").FlatRecord<WalletDistribution> & {
    _id: Types.ObjectId;
}>;
declare class VendorPayment {
    vendorId: string;
    amount: number;
}
export declare const VendorPaymentSchema: import("mongoose").Schema<VendorPayment, import("mongoose").Model<VendorPayment, any, any, any, Document<unknown, any, VendorPayment> & VendorPayment & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VendorPayment, Document<unknown, {}, import("mongoose").FlatRecord<VendorPayment>> & import("mongoose").FlatRecord<VendorPayment> & {
    _id: Types.ObjectId;
}>;
export declare class Order {
    items: OrderItem[];
    user: Types.ObjectId;
    erranderId?: Types.ObjectId;
    status: string;
    paymentStatus: string;
    paymentDetails?: PaymentDetails;
    vendorPayments?: VendorPayment[];
    walletDistribution?: WalletDistribution;
    totalPrice: number;
    address: number;
    phone: number;
    orderNotes: number;
    paymentType: string;
    isNewUser: boolean;
    isSubscription: boolean;
    startDate: Date;
    endDate: Date;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order> & Order & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>> & import("mongoose").FlatRecord<Order> & {
    _id: Types.ObjectId;
}>;
export {};
