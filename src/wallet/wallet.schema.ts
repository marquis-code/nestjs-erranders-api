// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { User } from '../user/user.schema'
// import { Types, Document } from "mongoose";

// export type WalletDocument = Wallet & Document;

// @Schema()
// export class Wallet {
//   @Prop({ type: Types.ObjectId, ref: "User", required: true })
//   userId: User;

//   @Prop({ required: true, default: 0 })
//   balance: number;
// }

// export const WalletSchema = SchemaFactory.createForClass(Wallet);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { Types, Document } from "mongoose";

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet {
  @Prop({ type: Types.ObjectId, ref: "User", required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ required: true, default: 0 })
  erranderEarnings: number;  // Amount earned from deliveries

  @Prop({ required: true, default: 0 })
  vendorEarnings: number;  // Amount vendors earn from sales

  @Prop({ required: true, default: 0 })
  businessEarnings: number;  // Amount business retains as commission

  @Prop({ type: [{ amount: Number, type: String, date: Date }], default: [] })
  transactions: { amount: number, type: string, date: Date }[];  // Transaction history
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
