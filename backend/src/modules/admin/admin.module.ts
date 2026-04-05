import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { User } from '../../entities/user.entity';
import { Interview } from '../../entities/interview.entity';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Interview, Question, Answer])],
  controllers: [AdminController],
})
export class AdminModule {}
