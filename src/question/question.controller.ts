import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Get()
  async findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @Post(':id/submit')
  async submitAnswer(
    @Param('id') id: string,
    @Body() body: { userAnswer: string },
  ) {
    return this.questionService.submitAnswer(id, body.userAnswer);
  }

  @Get('filter/:topic')
  async getQuestionsByTopic(@Param('topic') topic: string) {
    return this.questionService.findByTopic(topic);
  }
}
