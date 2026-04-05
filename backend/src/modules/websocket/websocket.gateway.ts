import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../../entities/question.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AnswersService } from '../answers/answers.service';
import { ProcessingService } from '../answers/processing.service';

@WebSocketGateway({
  cors: { origin: true, credentials: true },
})
export class WebsocketGateway {
  @WebSocketServer()
  server!: Server;

  private buffers = new Map<string, Buffer[]>();

  constructor(
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    private cloudinary: CloudinaryService,
    private answersService: AnswersService,
    private processingService: ProcessingService,
  ) {}

  @SubscribeMessage('audio_chunk')
  handleAudioChunk(
    @MessageBody() data: { interviewId: string; questionId: string; chunk: Buffer },
    @ConnectedSocket() _client: Socket,
  ) {
    const key = `${data.interviewId}:${data.questionId}`;
    const list = this.buffers.get(key) || [];
    list.push(Buffer.from(data.chunk));
    this.buffers.set(key, list);
  }

  @SubscribeMessage('answer_complete')
  async handleAnswerComplete(
    @MessageBody() data: { interviewId: string; questionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const key = `${data.interviewId}:${data.questionId}`;
    const chunks = this.buffers.get(key) || [];
    this.buffers.delete(key);

    const buffer = Buffer.concat(chunks);
    const question = await this.questionRepo.findOne({ where: { id: data.questionId }, relations: ['interview'] });
    if (!question) {
      client.emit('answer_error', { message: 'Question not found' });
      return;
    }

    const upload = await this.cloudinary.uploadAudio(buffer, key.replace(':', '_'));
    const processed = await this.processingService.processAnswer(upload.secure_url);

    await this.answersService.createForQuestion(question, {
      audio_url: upload.secure_url,
      transcript: processed.transcript,
      wpm: processed.metrics.wpm,
      pause_count: processed.metrics.pause_count,
      filler_count: processed.metrics.filler_count,
      duration: processed.metrics.duration,
      score: processed.evaluation.score,
      feedback: processed.evaluation.feedback,
      improved_answer: processed.evaluation.improved_answer,
    });

    client.emit('answer_saved', {
      questionId: data.questionId,
      transcript: processed.transcript,
      score: processed.evaluation.score,
    });
  }
}
