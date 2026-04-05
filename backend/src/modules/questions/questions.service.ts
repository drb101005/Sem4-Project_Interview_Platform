import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../../entities/question.entity';
import { AiService } from '../ai/ai.service';
import { Interview } from '../../entities/interview.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question) private repo: Repository<Question>,
    private aiService: AiService,
  ) {}

  async generateForInterview(interview: Interview) {
    const prompt = `Generate 5 interview questions as JSON array of strings.\nType: ${interview.type}.\nDifficulty: ${interview.difficulty}.\nResume: ${interview.resume_text}.\nJob Description: ${interview.job_description ?? 'N/A'}`;

    const questions = await this.aiService.generateQuestions(prompt);
    const saved: Question[] = [];
    for (let i = 0; i < questions.length; i += 1) {
      const q = this.repo.create({
        interview,
        question_text: questions[i],
        order_index: i,
      });
      saved.push(await this.repo.save(q));
    }
    return saved;
  }

  getByInterview(interviewId: string) {
    return this.repo.find({
      where: { interview: { id: interviewId } },
      order: { order_index: 'ASC' },
    });
  }
}
