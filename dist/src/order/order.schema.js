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
exports.OrderSchema = exports.Order = exports.VendorPaymentSchema = exports.WalletDistributionSchema = exports.PaymentDetailsSchema = exports.OrderItemSchema = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../product/product.schema");
let OrderItem = class OrderItem {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Product" }),
    __metadata("design:type", product_schema_1.Product)
], OrderItem.prototype, "product", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OrderItem.prototype, "vendorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], OrderItem.prototype, "price", void 0);
OrderItem = __decorate([
    (0, mongoose_1.Schema)()
], OrderItem);
exports.OrderItemSchema = mongoose_1.SchemaFactory.createForClass(OrderItem);
let PaymentDetails = class PaymentDetails {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PaymentDetails.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ["card", "wallet", "bank_transfer"] }),
    __metadata("design:type", String)
], PaymentDetails.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], PaymentDetails.prototype, "paymentDate", void 0);
PaymentDetails = __decorate([
    (0, mongoose_1.Schema)()
], PaymentDetails);
exports.PaymentDetailsSchema = mongoose_1.SchemaFactory.createForClass(PaymentDetails);
let WalletDistribution = class WalletDistribution {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WalletDistribution.prototype, "erranderWallet", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WalletDistribution.prototype, "vendorWallet", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WalletDistribution.prototype, "businessWallet", void 0);
WalletDistribution = __decorate([
    (0, mongoose_1.Schema)()
], WalletDistribution);
exports.WalletDistributionSchema = mongoose_1.SchemaFactory.createForClass(WalletDistribution);
let VendorPayment = class VendorPayment {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], VendorPayment.prototype, "vendorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], VendorPayment.prototype, "amount", void 0);
VendorPayment = __decorate([
    (0, mongoose_1.Schema)()
], VendorPayment);
exports.VendorPaymentSchema = mongoose_1.SchemaFactory.createForClass(VendorPayment);
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)([{ type: exports.OrderItemSchema }]),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Errander', required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "erranderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['pending', 'accepted', 'delivered'], default: 'pending' }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ["pending", "paid", "failed"], default: "pending" }),
    __metadata("design:type", String)
], Order.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.PaymentDetailsSchema, required: false }),
    __metadata("design:type", PaymentDetails)
], Order.prototype, "paymentDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: exports.VendorPaymentSchema, required: false }]),
    __metadata("design:type", Array)
], Order.prototype, "vendorPayments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.WalletDistributionSchema, required: false }),
    __metadata("design:type", WalletDistribution)
], Order.prototype, "walletDistribution", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Order.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], Order.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], Order.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], Order.prototype, "orderNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Order.prototype, "paymentType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "isNewUser", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "isSubscription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], Order.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], Order.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: { type: String, enum: ['Point'], required: true }, coordinates: { type: [Number], required: true } }),
    __metadata("design:type", Object)
], Order.prototype, "location", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)()
], Order);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
exports.OrderSchema.index({ location: '2dsphere' });
//# sourceMappingURL=order.schema.js.map