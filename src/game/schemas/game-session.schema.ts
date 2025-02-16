import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface GameSession {
  name: string;
  session_id: string;
  status: string;
}

export type GameSessionDocument = GameSession & Document;

@Schema({ timestamps: true })
export class GameSession {
  @Prop({ required: true })
  session_id: string;

  @Prop({ required: true })
  player1: string;

  @Prop()
  player2?: string; // Initially undefined, assigned when matched.

  @Prop({ default: 'waiting' }) // waiting, active, completed
  status: string;

  @Prop({ type: [String], default: [] }) // Store question IDs
  questions: string[];

  @Prop({ default: 0 })
  currentQuestionIndex: number;
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);
