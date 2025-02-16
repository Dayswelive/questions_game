import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start/:playerId')
  async startGame(@Param('playerId') playerId: string) {
    return this.gameService.createSession(playerId);
  }

  @Get('join/:sessionId')
  async getSession(@Param('sessionId') sessionId: string) {
    return this.gameService.getSessionById(sessionId);
  }

  @Post(':sessionId/submit-answer')
  async submitGameAnswer(
    @Param('sessionId') sessionId: string,
    @Body() body: { playerId: string; answer: string },
  ) {
    return this.gameService.submitAnswer(sessionId, body.playerId, body.answer);
  }
}
