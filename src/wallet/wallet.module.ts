import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './wallet.schema';
import { Order, OrderSchema } from '../order/order.schema';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [WalletController], // Add the controller here
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
