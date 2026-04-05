import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsocketGateway } from './websocket.gateway';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';
import { Interview } from '../../entities/interview.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AnswersModule } from '../answers/answers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Answer, Interview]),
    CloudinaryModule,
    AnswersModule,
  ],
  providers: [WebsocketGateway],
})
export class WebsocketModule {}
