import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../../entities/answer.entity';
import { Question } from '../../entities/question.entity';

@Injectable()
export class AnswersService {
  constructor(@InjectRepository(Answer) private repo: Repository<Answer>) {}

  async createForQuestion(question: Question, data: Partial<Answer>) {
    const answer = this.repo.create({
      question,
      ...data,
    });
    return this.repo.save(answer);
  }

  getByQuestion(questionId: string) {
    return this.repo.find({ where: { question: { id: questionId } } });
  }

  getByInterview(interviewId: string) {
    return this.repo.find({
      where: { question: { interview: { id: interviewId } } },
      relations: ['question', 'question.interview'],
    });
  }
}
