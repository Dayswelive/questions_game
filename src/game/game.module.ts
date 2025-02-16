import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameSession, GameSessionSchema } from './schemas/game-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameSession.name, schema: GameSessionSchema },
    ]),
  ],
  providers: [GameService, GameGateway],
  exports: [GameService],
})
export class GameModule {}
