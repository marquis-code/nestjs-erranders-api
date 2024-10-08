import { Module, forwardRef } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"

import { UserModule } from "../user/user.module"
import { ProductModule } from "../product/product.module"

import { ReviewController } from "./review.controller"
import { Review, ReviewSchema } from "./review.schema"
import { ReviewService } from "./review.service"
import { CacheConfigModule } from '../cache/cache.module';

@Module({
	imports: [
		forwardRef(() => UserModule),
		forwardRef(() => ProductModule),
		MongooseModule.forFeature([
			{ name: Review.name, schema: ReviewSchema },
		]),
		forwardRef(() => CacheConfigModule), // Import CacheConfigModule
	],
	exports: [
		MongooseModule.forFeature([
			{ name: Review.name, schema: ReviewSchema },
		]),
	],
	controllers: [ReviewController],
	providers: [ReviewService],
})
export class ReviewModule {}
