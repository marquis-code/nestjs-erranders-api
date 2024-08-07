import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, HydratedDocument } from "mongoose";
import { Testimonial, TestimonialSchema } from "./testimonial.schema";

export type ProductDocument = HydratedDocument<Product>;

export enum Category {
  "desktops",
  "computer accessories",
  "laptops",
  "laptop parts",
  "cctv",
  "printers and scanners",
  "networking and wifi",
  "gaming",
  "snacks",
  "groceries",
  "storage and memory",
  "smartphones",
  "tablets",
  "smartwatches",
  "home appliances",
  "kitchen appliances",
  "personal care",
  "beauty products",
  "clothing",
  "shoes",
  "books",
  "toys",
  "food",
  "sports equipment",
  "office supplies",
  "pet supplies",
  "automotive parts",
  "musical instruments",
  "furniture",
  "garden tools",
  "health and wellness",
}

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  id: false,
})
export class Product {
  @Prop({ required: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, maxlength: 2000 })
  description: string;

  @Prop({ required: true, default: 0, min: 0 })
  price: number;

  @Prop({ required: true, default: 1, min: 1 })
  currentInStock: number;

  @Prop({ required: true, enum: Category })
  category: string;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, enum: ["in-stock", "pre-order"], default: "in-stock" })
  productType: string;

  @Prop({ type: [TestimonialSchema], default: [], required: false })
  testimonials: Testimonial[];

  @Prop({ type: [String], default: ["S", "MD", "L", "XL", "XXL"] })
  sizeList: string[];

  @Prop({ required: true })
  cloudinary_id: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  createdBy: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});
