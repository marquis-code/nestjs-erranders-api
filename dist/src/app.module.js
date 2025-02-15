"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const serve_static_1 = require("@nestjs/serve-static");
const auth_module_1 = require("./auth/auth.module");
const product_module_1 = require("./product/product.module");
const review_module_1 = require("./review/review.module");
const user_module_1 = require("./user/user.module");
const image_module_1 = require("./image/image.module");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("./cloudinary/cloudinary.service");
const cloudinary_config_1 = require("./cloudinary.config");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
const multer = __importStar(require("multer"));
const path_1 = require("path");
const orders_module_1 = require("./order/orders.module");
const notification_gateway_1 = require("./notification/notification.gateway");
const notification_service_1 = require("./notification/notification.service");
const notification_module_1 = require("./notification/notification.module");
const wallet_module_1 = require("./wallet/wallet.module");
const transaction_module_1 = require("./transaction/transaction.module");
const chat_module_1 = require("./chat/chat.module");
const cache_module_1 = require("./cache/cache.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            cache_module_1.CacheConfigModule,
            platform_express_1.MulterModule.register({
                storage: multer.memoryStorage(),
            }),
            cloudinary_module_1.CloudinaryModule,
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGO_URI'),
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                }),
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60,
                    limit: 100,
                },
            ]),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, "..", "uploads"),
                serveRoot: "/uploads",
                serveStaticOptions: { index: false },
            }),
            image_module_1.ImageModule,
            user_module_1.UserModule,
            auth_module_1.AuthMoudle,
            product_module_1.ProductModule,
            review_module_1.ReviewModule,
            orders_module_1.OrderModule,
            notification_module_1.NotificationModule,
            wallet_module_1.WalletModule,
            transaction_module_1.TransactionModule,
            chat_module_1.ChatModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            cloudinary_service_1.CloudinaryService,
            {
                provide: "Cloudinary",
                useFactory: cloudinary_config_1.configureCloudinary,
                inject: [config_1.ConfigService],
            },
            notification_gateway_1.NotificationGateway,
            notification_service_1.NotificationService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map