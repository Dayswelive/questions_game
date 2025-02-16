import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface GameSession {
  name: string;
  session_id: string;
  status: string;
}

export type GameSessionDocument = GameSession & Document;

@Schema()
export class QuestionSchema {
  @Prop({ required: true })
  questionText: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctOptionIndex: number;
}
export const QuestionSchemaFactory =
  SchemaFactory.createForClass(QuestionSchema);

@Schema({ timestamps: true })
export class GameSession {
  @Prop({ required: true, default: uuidv4 })
  session_id: string;

  @Prop({ required: true })
  player1: string;

  @Prop()
  player2?: string;

  @Prop({ default: 'waiting' })
  status: string;

  @Prop({ type: [QuestionSchemaFactory], required: true })
  questions: QuestionSchema[];

  @Prop({ default: 0 })
  currentQuestionIndex: number;

  @Prop({
    type: [
      {
        playerId: String,
        answer: String,
        isCorrect: Boolean,
        questionIndex: Number,
      },
    ],
    default: [],
  })
  answers: {
    playerId: string;
    answer: string;
    isCorrect: boolean;
    questionIndex: number;
  }[];
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);
