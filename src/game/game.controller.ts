import { Controller, Post, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start/:playerId')
  async startGame(@Param('playerId') playerId: string) {
    return this.gameService.createSession(playerId);
  }

  @Get(':sessionId')
  async getSession(@Param('sessionId') sessionId: string) {
    return this.gameService.getSessionById(sessionId);
  }
}
