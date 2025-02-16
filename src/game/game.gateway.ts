import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { MessageBody, ConnectedSocket } from '@nestjs/websockets';
@WebSocketGateway({ cors: true })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('message', 'Connected to WebSocket Server');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // ✅ Player Joins a Game
  @SubscribeMessage('joinGame')
  async handleJoinGame(client: Socket, payload: any) {
    const { player_id } = payload;
    const gameSession = await this.gameService.createSession(player_id);

    client.join(gameSession.session_id);
    this.server.to(gameSession.session_id).emit('game:update', gameSession);
  }

  // ✅ Start the Game and Send First Question
  @SubscribeMessage('startGame')
  async handleStartGame(client: Socket, payload: any) {
    const { session_id } = payload;

    const firstQuestion = await this.gameService.startGame(session_id);

    if (firstQuestion) {
      this.server.to(session_id).emit('question:send', firstQuestion);
    } else {
      client.emit('error', 'No questions available');
    }
  }

  // ✅ Handle Answer Submission
  @SubscribeMessage('submitAnswer')
  async handleSubmitAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    try {
      const { session_id, player_id, answer } = payload;
      const result = await this.gameService.submitAnswer(
        session_id,
        player_id,
        answer,
      );

      // Emit the result back to the client
      client.emit('answer:result', { isCorrect: result.isCorrect });
    } catch (error) {
      console.error('Error processing answer:', error);
      client.emit('answer:result', { error: error.message });
    }
  }
}
