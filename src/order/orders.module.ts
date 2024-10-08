import { Module, forwardRef } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { OrderController } from "./order.controller"
import { Order, OrderSchema } from "./order.schema"
import { OrderService } from "../order/order.service"
import { UserModule } from "../user/user.module"
import { ReviewModule } from "../review/review.module"
import { ProductModule } from "../product/product.module"
import { NotificationModule } from '../notification/notification.module'; 
import { WalletModule } from "../wallet/wallet.module"
import { OrderGateway } from "./order.gateway"
import { CacheConfigModule } from '../cache/cache.module';
//REMEMBER TO INJECT THE NOTIFICATION SERVICE AND USER SERVICE TO AVOID CIRCULAR DEPENDENCY ISSUES

@Module({
	imports: [
		forwardRef(() => ProductModule),
		forwardRef(() => UserModule),
        forwardRef(() => ReviewModule),
        forwardRef(() => NotificationModule),
		forwardRef(() => WalletModule),
		MongooseModule.forFeature([
			{ name: Order.name, schema: OrderSchema },
		]),
		forwardRef(() => CacheConfigModule), // Import CacheConfigModule
	],
	exports: [
		MongooseModule.forFeature([
			{ name: Order.name, schema: OrderSchema },
		]),
	],
	controllers: [OrderController],
	providers: [OrderService, OrderGateway],
})
export class OrderModule {}
