import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '../../entities/answer.entity';
import { AnswersService } from './answers.service';
import { ProcessingService } from './processing.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Answer]), AiModule],
  providers: [AnswersService, ProcessingService],
  exports: [AnswersService, ProcessingService],
})
export class AnswersModule {}
