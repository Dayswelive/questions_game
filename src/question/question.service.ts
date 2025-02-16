import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { CreateQuestionDto } from './dto/create-question.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const newQuestion = new this.questionModel(createQuestionDto);
    return newQuestion.save();
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }

  async findOne(id: string): Promise<Question | null> {
    return this.questionModel.findById(id).exec();
  }

  async submitAnswer(id: string, userAnswer: string): Promise<any> {
    const question = await this.questionModel.findById(id).exec();
    if (!question) throw new NotFoundException('Question not found');

    const correctAnswer = question.options[question.correctOptionIndex];
    console.log(correctAnswer);
  }

  async findByTopic(topic: string): Promise<Question[]> {
    return this.questionModel.find({ topic }).exec();
  }
}
