import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({
    required: [true, 'Message is required'],
  })
  message: string;

  @Prop({
    required: [true, 'Sender is required'],
  })
  sender: string;

  @Prop({
    required: [true, 'Recipient is required'],
  })
  recipient: string;

  @Prop({
    required: [true, 'Time is required'],
  })
  time: string;

  @Prop({
    type: [{ type: String }],
    default: [],
  })
  images: string[]; // Array of image URLs or paths

  @Prop({
    type: [
      {
        filename: String,
        url: String,
        mimeType: String,
        size: Number,
      },
    ],
    default: [],
  })
  files: Array<{
    filename: string;
    url: string;
    mimeType: string;
    size: number; // Size in bytes
  }>;

  constructor(chat?: Partial<Chat>) {
    Object.assign(this, chat);
  }
}

// Generate the schema
export const ChatSchema = SchemaFactory.createForClass(Chat);
