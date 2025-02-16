import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model,Connection, ClientSession, Types } from 'mongoose';
import { Wallet, WalletDocument } from './wallet.schema';
import { Order, OrderDocument } from '../order/order.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}


  // async createWallet(userId: string): Promise<Types.ObjectId> {
  //   const newWallet = new this.walletModel({ userId, balance: 0 });
  //   const savedWallet = await newWallet.save();
  //   return savedWallet._id
  // }
  async createWallet(userId: string): Promise<Types.ObjectId> {
    const newWallet = new this.walletModel({ userId, balance: 0, transactions: [] });
    const savedWallet = await newWallet.save();
    return savedWallet._id;
  }

  // async creditWallet(userId: string, amount: number, transaction: any): Promise<void> {
  //   await this.walletModel.updateOne(
  //     { userId },
  //     {
  //       $inc: { balance: amount },
  //       $push: { transactions: transaction } // Logs transaction
  //     }
  //   );
  // }

  // async creditWallet(userId: string, amount: number): Promise<void> {
  //   await this.walletModel.updateOne({ userId }, { $inc: { balance: amount } });
  // }

  async creditWallet(userId: string, amount: number, transaction?: any): Promise<void> {
    const updateQuery: any = { $inc: { balance: amount } };
    if (transaction) {
      updateQuery.$push = { transactions: transaction };
    }
    await this.walletModel.updateOne({ userId }, updateQuery);
  }

  async getWalletProfile(userId: string): Promise<WalletDocument | null> {
    return this.walletModel.findOne({ userId }).exec();
  }

  // async updateWallets(
  //   erranderId: string | undefined,
  //   vendorShares: { vendorId: string, amount: number }[],
  //   erranderShare: number,
  //   businessShare: number
  // ): Promise<void> {
  //   const session: ClientSession = await this.connection.startSession();
  //   session.startTransaction();

  //   try {
  //     if (erranderId) {
  //       await this.walletModel.updateOne(
  //         { userId: erranderId },
  //         { $inc: { balance: erranderShare } },
  //         { session }
  //       );
  //     }

  //     for (const { vendorId, amount } of vendorShares) {
  //       await this.walletModel.updateOne(
  //         { userId: vendorId },
  //         { $inc: { balance: amount } },
  //         { session }
  //       );
  //     }

  //     await this.walletModel.updateOne(
  //       { userId: 'business_wallet' },
  //       { $inc: { balance: businessShare } },
  //       { session }
  //     );

  //     await session.commitTransaction();
  //   } catch (error) {
  //     await session.abortTransaction();
  //     throw error;
  //   } finally {
  //     session.endSession();
  //   }
  // }

  // async updateWallets(
  //   erranderId: string | undefined,
  //   erranderShare: number,
  //   vendorShares: { vendorId: string, amount: number }[],
  //   businessShare: number
  // ): Promise<void> {
  //   const session: ClientSession = await this.connection.startSession();
  //   session.startTransaction();

  //   try {
  //     if (erranderId) {
  //       await this.walletModel.updateOne(
  //         { userId: erranderId.toString() },
  //         { $inc: { balance: erranderShare } },
  //         { session }
  //       );
  //     }

  //     for (const { vendorId, amount } of vendorShares) {
  //       await this.walletModel.updateOne(
  //         { userId: vendorId.toString() },
  //         { $inc: { balance: amount } },
  //         { session }
  //       );
  //     }

  //     await this.walletModel.updateOne(
  //       { userId: 'business_wallet' },
  //       { $inc: { balance: businessShare } },
  //       { session }
  //     );

  //     await session.commitTransaction();
  //   } catch (error) {
  //     await session.abortTransaction();
  //     throw error;
  //   } finally {
  //     session.endSession();
  //   }
  // }

  async updateWallets(
    erranderId: string | undefined,
    erranderShare: number,
    vendorShares: { vendorId: string, amount: number }[],
    businessShare: number
  ): Promise<void> {
    const session: ClientSession = await this.connection.startSession();
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
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  


  // async handleOrderCompletion(orderId: string): Promise<void> {
  //   const session: ClientSession = await this.connection.startSession();
  //   session.startTransaction();

  //   try {
  //     const order = await this.orderModel.findById(orderId).exec();
  //     if (order && order.status === 'delivered') {
  //       const erranderShare = order.erranderId ? order.totalPrice * 0.2 : 0;
  //       const businessShare = order.totalPrice * 0.1;

  //       const vendorShares = order.items.map(item => ({
  //         vendorId: item.vendorId,
  //         amount: item.price * 0.7, // Vendor now receives a higher percentage
  //       }));

  //       await this.updateWallets(
  //         order.erranderId?.toString(),
  //         vendorShares,
  //         erranderShare,
  //         businessShare
  //       );
  //     }
  //     await session.commitTransaction();
  //   } catch (error) {
  //     await session.abortTransaction();
  //     throw error;
  //   } finally {
  //     session.endSession();
  //   }
  // }
  async handleOrderCompletion(orderId: string): Promise<void> {
    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();

    try {
      const order = await this.orderModel.findById(orderId).exec();
      if (order && order.status === 'delivered') {
        const erranderShare = order.erranderId ? order.totalPrice * 0.2 : 0;
        const businessShare = order.totalPrice * 0.1;

        const vendorShares = order.items.map(item => ({
          vendorId: item.vendorId.toString(), // Convert ObjectId to string
          amount: item.price * 0.7, // Vendor now receives a higher percentage
        }));

        await this.updateWallets(
          order.erranderId?.toString(),
          erranderShare,        // Moved to correct position
          vendorShares,         // Moved to correct position
          businessShare
        );
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  

  async acceptOrder(orderId: string, erranderId: string): Promise<void> {
    await this.orderModel.updateOne({ _id: orderId }, { $set: { erranderId, status: 'accepted' } });
  }

  async markOrderAsDelivered(orderId: string): Promise<void> {
    await this.orderModel.updateOne({ _id: orderId }, { $set: { status: 'delivered' } });
    await this.handleOrderCompletion(orderId);
  }

  async getTransactionsForVendor(vendorId: string): Promise<Order[]> {
    return this.orderModel.find({ 'items.vendorId': vendorId, status: 'delivered' }).exec();
  }

  // async getOrdersForErrander(erranderId: string): Promise<Order[]> {
  //   return this.orderModel.find({ erranderId }).exec();
  // }
  async getOrdersForErrander(erranderId: string): Promise<Order[]> {
    return this.orderModel.find({ erranderId }).populate('items.product user').exec();
  }
}