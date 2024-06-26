// nest.js modules
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

// types
import { Model } from "mongoose";
import { Role } from "../role/role.enum";

// schema
import { User, UserDocument } from "./user.schema";
import { Review, ReviewDocument } from "../review/review.schema";

// DTOs
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { WalletService } from "../wallet/wallet.service";


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly User: Model<UserDocument>,
    @InjectModel(Review.name) private readonly Review: Model<ReviewDocument>,
    private readonly walletService: WalletService
  ) {}

  async getUsers() {
    const users = await this.User.find();

    return { users };
  }

  async createUser(dto: CreateUserDto) {
    let user = await this.User.findOne({ email: dto.email });

    if (user) {
      throw new ConflictException(["A user already exists with the entered email"]);
    }

    user = new this.User(dto);
    const savedUser = await user.save();

    const wallet = await this.walletService.createWallet(savedUser._id.toString());
    savedUser.wallet = wallet;
    await savedUser.save();

    const populatedUser = await this.User.findById(savedUser._id).populate('wallet').exec();

    populatedUser.password = undefined;

    return { user: savedUser };
  }

  async getUser(id: string) {
    const user = await this.User.findById(id).populate('wallet').exec();;

    if (!user)
      throw new NotFoundException(["No user found with the entered ID"]);

    return { user };
  }

  async updateUser(id: string, dto: UpdateUserDto, currentUser: UserDocument) {
    const user = await this.User.findById(id);

    if (!user)
      throw new NotFoundException(["No user found with the entered ID"]);

    if (currentUser.id !== user.id)
      throw new ForbiddenException([
        "The current user can't access this resource",
      ]);

    user.name = dto.name;
    user.phone = dto.phone;
    user.role = currentUser.role === Role.Admin ? dto.role : user.role;

    await user.save();

    return { user };
  }

  async deleteUser(id: string, currentUser: UserDocument) {
    const user = await this.User.findById(id);

    if (!user)
      throw new NotFoundException(["No user found with the entered ID"]);

    if (currentUser.id !== user.id)
      throw new ForbiddenException([
        "The current user can't access this resource",
      ]);

    await user.deleteOne();

    await this.Review.deleteMany({ user: user._id });

    return {};
  }
}
