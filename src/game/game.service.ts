import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import {
  GameSession,
  GameSessionDocument,
} from './schemas/game-session.schema';
import {
  Question,
  QuestionDocument,
} from '../question/schemas/question.schema';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    @InjectModel(GameSession.name)
    private gameSessionModel: Model<GameSessionDocument>,

    @InjectModel(Question.name)
    private questionModel: Model<QuestionDocument>,
  ) {}

  // ✅ Create or Join a Session
  async createSession(playerId: string) {
    const questions = await this.questionModel.find().limit(5).exec();
    const waitingSession = await this.gameSessionModel.findOne({
      status: 'waiting',
    });

    if (waitingSession) {
      waitingSession.player2 = playerId;
      waitingSession.status = 'active';
      await waitingSession.save();
      this.logger.log(`Matched ${waitingSession.player1} with ${playerId}`);
      return waitingSession;
    }

    const session = new this.gameSessionModel({
      player1: playerId,
      questions: questions.map((q) => ({
        questionText: q.questionText,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
      })),
      currentQuestionIndex: 0,
      status: 'active',
    });

    return session.save();
  }

  // ✅ Fetch Game Session
  async getSessionById(sessionId: string) {
    const gameSession = await this.gameSessionModel.findOne({
      session_id: sessionId,
    });
    if (!gameSession) {
      throw new NotFoundException('Game session not found');
    }
    return gameSession;
  }

  // Start Game and Fetch First Question
  async startGame(sessionId: string) {
    const session = await this.getSessionById(sessionId);
    if (!session.questions.length) {
      throw new NotFoundException('No questions available for this game');
    }

    session.currentQuestionIndex = 0;
    await session.save();
    return session.questions[session.currentQuestionIndex];
  }

  // Submit Answer

  async submitAnswer(sessionId: string, playerId: string, answer: string) {
    const session = await this.gameSessionModel.findById(sessionId);
    if (!session) throw new NotFoundException('Session not found');

    const currentQuestionIndex = session.currentQuestionIndex;
    const questionId = session.questions[currentQuestionIndex];

    if (!questionId)
      throw new NotFoundException('No question found for the current index');

    // Fetch question from database
    const question = await this.questionModel.findById(questionId);
    if (!question) throw new NotFoundException('Question not found');

    // Get correct answer
    const correctAnswer = question.options[question.correctOptionIndex];

    // Compare with submitted answer
    const isCorrect = correctAnswer === answer;

    session.answers.push({
      playerId,
      answer,
      isCorrect,
      questionIndex: currentQuestionIndex,
    });
    await session.save();

    return { message: 'Answer submitted successfully', isCorrect };
  }
  // Check if both players have answered
  async allPlayersAnswered(sessionId: string) {
    const session = await this.getSessionById(sessionId);
    const { player1, player2, currentQuestionIndex, answers } = session;

    const player1Answered = answers.some(
      (ans) =>
        ans.playerId === player1 && ans.questionIndex === currentQuestionIndex,
    );
    const player2Answered = answers.some(
      (ans) =>
        ans.playerId === player2 && ans.questionIndex === currentQuestionIndex,
    );

    return player1Answered && player2Answered;
  }

  // Fetch Next Question
  async getNextQuestion(sessionId: string) {
    const session = await this.getSessionById(sessionId);

    session.currentQuestionIndex += 1;
    await session.save();

    if (session.currentQuestionIndex >= session.questions.length) {
      return null;
    }

    return session.questions[session.currentQuestionIndex];
  }

  // Determine Game Winner
  async calculateGameResult(sessionId: string) {
    const session = await this.getSessionById(sessionId);
    const { player1, player2, answers } = session;

    const player1Score = answers.filter(
      (ans) => ans.playerId === player1 && ans.isCorrect,
    ).length;
    const player2Score = answers.filter(
      (ans) => ans.playerId === player2 && ans.isCorrect,
    ).length;

    return {
      winner:
        player1Score > player2Score
          ? player1
          : player2Score > player1Score
            ? player2
            : 'draw',
      player1Score,
      player2Score,
    };
  }
}
