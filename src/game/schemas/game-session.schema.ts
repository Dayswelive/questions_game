import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
export interface GameSession {
  name: string;
  session_id: string;
  status: string;
}

export type GameSessionDocument = GameSession & Document;

@Schema({ timestamps: true })
export class GameSession {
  @Prop({ required: true, default: uuidv4 })
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

  @Prop({ type: [{ playerId: String, answer: String }], default: [] })
  answers: { playerId: string; answer: string }[];
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);
