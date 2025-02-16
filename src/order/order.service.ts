import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Order, OrderDocument } from "./order.schema";
import { Product, ProductDocument } from "../product/product.schema";
import { CreateOrderDto } from "./order.dto";
import { NotificationService } from "../notification/notification.service";
import { User, UserDocument } from "../user/user.schema";
import { OrderGateway } from "../order/order.gateway";
import { CacheService } from '../cache/cache.service';
import { WalletService } from "../wallet/wallet.service";
import { Subject } from 'rxjs';

@Injectable()
export class OrderService {
  private orderCreated = new Subject<Order>();
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly notificationService: NotificationService,
    private orderGateway: OrderGateway,
    private readonly walletService: WalletService,
    private readonly cacheService: CacheService
    // @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    // @InjectModel(Product.name)
    // @InjectModel(User.name)
    // @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    // @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    // @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    // private readonly productModel: Model<ProductDocument>,
    // private readonly userModel: Model<UserDocument>,
    // private readonly notificationService: NotificationService,
    // private orderGateway: OrderGateway,
    // private readonly cacheService: CacheService 
  ) {}

  emitOrder(order: Order) {
    this.orderCreated.next(order);
  }

  getOrderEvents() {
    return this.orderCreated.asObservable();
  }


  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const items = await Promise.all(
      dto.items.map(async (item) => {
        const product = await this.productModel.findById(item.product);
        if (!product)
          throw new NotFoundException(`Product not found: ${item.product}`);
        if (product.currentInStock < item.quantity) {
          throw new BadRequestException(
            `Not enough stock available for product: ${item.product}`
          );
        }
  
        product.currentInStock -= item.quantity;
        await product.save();
  
        return {
          product: product._id,
          quantity: item.quantity,
          price: product.price,
          vendorId: item.vendorId,  // Ensure vendorId is included
        };
      })
    );
  
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  
    const order = new this.orderModel({
      items,
      user: dto.user,
      totalPrice,
      location: dto.location,
      status: dto.status || 'pending',  // Ensure status defaults to 'pending' if not provided
      // erranderId is optional and not set at creation
    });
    const savedOrder = await order.save();
    this.emitOrder(savedOrder);
  
    //  Notify nearby erranders
    await this.notifyNearbyErranders(savedOrder);
  
    return savedOrder;
  }
  

  async notifyNearbyErranders(order: any) {
    if (!order.location || !order.location.coordinates) {
      throw new BadRequestException("Order location is required.");
    }

    console.log('Order location:', order.location.coordinates);
    let erranders = await this.userModel.find({
      role: "errander",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: order?.location?.coordinates,
          },
          $maxDistance: 10000, // 10 km
        },
      },
    });
    console.log(erranders, 'found erranders');
    this.orderGateway.notify('erranders-notified', order);

    if (erranders.length === 0) {
      // If no erranders found nearby, notify all erranders
      erranders = await this.userModel.find({
        role: 'errander',
      });
      // throw new NotFoundException("No Errander was found to pickup your order.");
    }

    const notificationMessage = `A new order has been placed${erranders.length === 0 ? '' : ' nearby'}.`;

    if (erranders.length) {
      for (const errander of erranders) {
        await this.notificationService.sendNotification(
          errander._id,
          "New Order Available",
          `A new order has been placed nearby.`,
          { orderId: order._id, orderDetails: order }
        );
      }
    }
  }

  async acceptOrder(orderId: string, erranderId: string): Promise<void> {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException("Order not found");

      // Update the order with the erranderId
     // Convert erranderId to ObjectId and update the order
    order.erranderId = new Types.ObjectId(erranderId);
    order.status = 'accepted';
    await order.save();

    // Notify the user who made the order
    const user = await this.userModel.findById(order.user);
    if (user) {
      await this.notificationService.sendNotification(
        user._id,
        "Order Accepted",
        `Your order has been accepted by an errander.`,
        { orderId: order._id }
      );
    }
  }

  async markOrderAsDelivered(orderId: string): Promise<void> {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException("Order not found");

    order.status = 'delivered';
    await order.save();

    // Trigger wallet distribution after delivery
    await this.handleWalletDistribution(order);
  }

  // async handleWalletDistribution(order: Order) {
  //   const { totalPrice } = order;
  //   const erranderShare = totalPrice * 0.3;
  //   const vendorShare = totalPrice * 0.6;
  //   const businessShare = totalPrice * 0.1;

  //   await this.walletService.updateWallets(
  //     order.erranderId,
  //     erranderShare,
  //     order.items.map(item => item.vendorId),
  //     vendorShare,
  //     businessShare
  //   );
  // }

//   async handleWalletDistribution(order: Order) {
//     const { totalPrice } = order;
//     const erranderShare = totalPrice * 0.3;
//     const vendorShare = totalPrice * 0.6;
//     const businessShare = totalPrice * 0.1;

//     // Create vendorShares array with the correct structure
//     const vendorShares = order.items.map(item => ({
//         vendorId: item.vendorId,
//         amount: (vendorShare / order.items.length) // Distributing vendor share equally among vendors
//     }));

//     await this.walletService.updateWallets(
//        order.erranderId?.toString(), // Convert ObjectId to string
//         erranderShare,
//         vendorShares,
//         businessShare
//     );
// }

// async handleWalletDistribution(order: Order) {
//   if (!order) {
//     throw new NotFoundException('Order not found');
//   }
  
//   const { totalPrice } = order;
//   const erranderShare = totalPrice * 0.3;
//   const businessShare = totalPrice * 0.1;

//   const vendorShares = order.items.map(item => ({
//     vendorId: item.vendorId.toString(),
//     amount: item.price * 0.6, // Each vendor receives 60% of their respective item's price
//   }));

//   await this.walletService.updateWallets(
//     order.erranderId?.toString(),
//     erranderShare,
//     vendorShares,
//     businessShare
//   );

//   // await this.updateWallets(
//   //   order.erranderId?.toString(),
//   //   erranderShare,
//   //   vendorShares,
//   //   businessShare
//   // );
// }

async handleWalletDistribution(order: Order) {
  if (!order) {
    throw new NotFoundException('Order not found');
  }
  
  const { totalPrice } = order;
  const erranderShare = totalPrice * 0.3;
  const businessShare = totalPrice * 0.1;

  const vendorShares = order.items.map(item => ({
    vendorId: item.vendorId.toString(),
    amount: item.price * 0.6, // Each vendor receives 60% of their respective item's price
  }));

  // ✅ Ensure we call the method from WalletService
  await this.walletService.updateWallets(
    order.erranderId?.toString(),
    erranderShare,
    vendorShares,
    businessShare
  );
}



  async getOrders() {
    try {
      // Attempt to retrieve cached orders from the cache service
      const cachedOrders = await this.cacheService.get('orders');
  
      if (cachedOrders) {
        // If cached orders exist, parse the JSON and return it
        return { orders: JSON.parse(cachedOrders), fromCache: true };
      }
  
      // If no cached orders are found, retrieve orders from the database
      const orders = await this.orderModel.find().populate("items.product").exec();
  
      // Cache the retrieved orders for future use
      await this.cacheService.set('orders', JSON.stringify(orders));
  
      // Return the orders with a flag indicating they are not from cache
      return { orders, fromCache: false };
    } catch (error) {
      // Handle any errors that occur during the process
      throw new InternalServerErrorException('Something went wrong');
    }
  }
  

  async deleteOrder(id: string): Promise<void> {
    const order = await this.orderModel.findByIdAndDelete(id);
    if (!order) throw new NotFoundException("Order not found");

    await Promise.all(
      order.items.map(async (item) => {
        const product = await this.productModel.findById(item.product);
        if (product) {
          product.currentInStock += item.quantity;
          await product.save();
        }
      })
    );
  }

  // async getUserOrders(userId: string): Promise<Order[]> {
  //   const objectId = new Types.ObjectId(userId);
  //   return this.orderModel.find({ user: objectId }).exec();
  // }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      // Construct a cache key specific to the user's orders
      const cacheKey = `user_orders_${userId}`;
      
      // Attempt to retrieve cached user orders from the cache service
      const cachedOrders = await this.cacheService.get(cacheKey);
      
      if (cachedOrders) {
        // If cached orders exist, parse the JSON and return it
        return JSON.parse(cachedOrders);
      }
  
      // If no cached orders are found, retrieve user orders from the database
      const objectId = new Types.ObjectId(userId);
      const orders = await this.orderModel.find({ user: objectId }).exec();
  
      // Cache the retrieved orders for future use
      await this.cacheService.set(cacheKey, JSON.stringify(orders));
  
      // Return the orders retrieved from the database
      return orders;
    } catch (error) {
      // Handle any errors that occur during the process
      throw new InternalServerErrorException('Something went wrong');
    }
  }
  

  // async getOrdersByVendor(vendorId: string): Promise<Order[]> {
  //   return this.orderModel.find({ 'items.vendorId': vendorId }).populate('user').populate('items.product').exec();
  // }

  async getOrdersByVendor(vendorId: string): Promise<Order[]> {
    try {
      // Construct a unique cache key for the vendor's orders
      const cacheKey = `vendor_orders_${vendorId}`;
      
      // Attempt to retrieve cached orders for the vendor
      const cachedOrders = await this.cacheService.get(cacheKey);
      
      if (cachedOrders) {
        // If cached orders exist, parse the JSON and return it
        return JSON.parse(cachedOrders);
      }
  
      // If no cached orders are found, query the database for the vendor's orders
      const orders = await this.orderModel
        .find({ 'items.vendorId': vendorId })
        .populate('user')
        .populate('items.product')
        .exec();
  
      // Cache the retrieved orders for future use
      await this.cacheService.set(cacheKey, JSON.stringify(orders));
  
      // Return the orders retrieved from the database
      return orders;
    } catch (error) {
      // Handle any errors that occur during the process
      throw new InternalServerErrorException('Something went wrong');
    }
  }
  
}
