import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../../entities/question.entity';
import { QuestionsService } from './questions.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), AiModule],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
