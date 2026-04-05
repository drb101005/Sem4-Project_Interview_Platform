import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from '../../entities/interview.entity';
import { Question } from '../../entities/question.entity';
import { InterviewsService } from './interviews.service';
import { InterviewsController } from './interviews.controller';
import { UsersModule } from '../users/users.module';
import { QuestionsModule } from '../questions/questions.module';
import { AnswersModule } from '../answers/answers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interview, Question]),
    UsersModule,
    QuestionsModule,
    AnswersModule,
  ],
  providers: [InterviewsService],
  controllers: [InterviewsController],
  exports: [InterviewsService],
})
export class InterviewsModule {}
