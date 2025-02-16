import { Controller, Post, Get, Body, Param, Put, NotFoundException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Types } from 'mongoose';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async createWallet(
    @Body('userId') userId: string
  ): Promise<Types.ObjectId> {
    return this.walletService.createWallet(userId);
  }

  @Post(':userId/credit')
  async creditWallet(
    @Param('userId') userId: string,
    @Body('amount') amount: number
  ): Promise<void> {
    await this.walletService.creditWallet(userId, amount);
  }

  @Put('orders/:orderId/accept')
  async acceptOrder(
    @Param('orderId') orderId: string,
    @Body('erranderId') erranderId: string
  ): Promise<void> {
    await this.walletService.acceptOrder(orderId, erranderId);
  }

  @Put('orders/:orderId/deliver')
  async markOrderAsDelivered(
    @Param('orderId') orderId: string
  ): Promise<void> {
    await this.walletService.markOrderAsDelivered(orderId);
  }

  @Get('vendors/:vendorId/transactions')
  async getVendorTransactions(
    @Param('vendorId') vendorId: string
  ) {
    return this.walletService.getTransactionsForVendor(vendorId);
  }

  @Get('erranders/:erranderId/orders')
  async getEranderOrders(
    @Param('erranderId') erranderId: string
  ) {
    return this.walletService.getOrdersForErrander(erranderId);
  }

  @Get(':userId')
async getWalletProfile(
  @Param('userId') userId: string
) {
  const wallet = await this.walletService.getWalletProfile(userId);
  if (!wallet) {
    throw new NotFoundException('Wallet not found');
  }
  return wallet;
}
}