import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Interview } from '../../entities/interview.entity';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';

@Controller('admin')
export class AdminController {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Interview) private interviewRepo: Repository<Interview>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
  ) {}

  @Get('users')
  getUsers() {
    return this.userRepo.find({ order: { email: 'ASC' } });
  }

  @Get('interviews')
  getInterviews() {
    return this.interviewRepo.find({ relations: ['user'], order: { id: 'DESC' } });
  }

  @Get('interview/:id')
  async getInterview(@Param('id') id: string) {
    const interview = await this.interviewRepo.findOne({
      where: { id },
      relations: ['user', 'questions'],
    });

    const questions = await this.questionRepo.find({
      where: { interview: { id } },
      order: { order_index: 'ASC' },
    });

    const answers = await this.answerRepo.find({
      where: { question: { interview: { id } } },
      relations: ['question'],
    });

    return { interview, questions, answers };
  }
}
