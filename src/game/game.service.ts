import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GameSession,
  GameSessionDocument,
} from './schemas/game-session.schema';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    @InjectModel(GameSession.name)
    private gameSessionModel: Model<GameSessionDocument>,
  ) {}

  async createSession(playerId: string) {
    // Check if a player is already waiting for a match
    const waitingSession = await this.gameSessionModel.findOne({
      status: 'waiting',
    });

    if (waitingSession) {
      // Assign the second player to the existing session
      waitingSession.player2 = playerId;
      waitingSession.status = 'active'; // Game starts
      await waitingSession.save();
      this.logger.log(`Matched ${waitingSession.player1} with ${playerId}`);
      return waitingSession;
    }

    // No waiting session, create a new one
    const newSession = new this.gameSessionModel({ player1: playerId });
    await newSession.save();
    this.logger.log(`Created a new game session for ${playerId}`);
    return newSession;
  }

  async getSessionById(sessionId: string) {
    return this.gameSessionModel.findById(sessionId);
  }
}
