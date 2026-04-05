import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from '../../entities/interview.entity';
import { Question } from '../../entities/question.entity';
import { UsersService } from '../users/users.service';
import { QuestionsService } from '../questions/questions.service';
import { AnswersService } from '../answers/answers.service';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(Interview) private repo: Repository<Interview>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    private usersService: UsersService,
    private questionsService: QuestionsService,
    private answersService: AnswersService,
  ) {}

  async startInterview(userId: string, data: { type: string; difficulty: string; resume_text: string; job_description?: string }) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const freeLimitReached = user.interviews_used >= 3 && !user.api_key;
    if (freeLimitReached) {
      throw new BadRequestException('Free limit reached. Add API key.');
    }

    const interview = this.repo.create({
      user,
      type: data.type,
      difficulty: data.difficulty,
      resume_text: data.resume_text,
      job_description: data.job_description ?? null,
      status: 'in_progress',
    });

    const saved = await this.repo.save(interview);
    await this.usersService.incrementInterviewsUsed(userId);

    const questions = await this.questionsService.generateForInterview(saved);

    return { interview: saved, questions };
  }

  async listForUser(userId: string) {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });
  }

  async getInterview(interviewId: string, userId: string) {
    const interview = await this.repo.findOne({
      where: { id: interviewId, user: { id: userId } },
      relations: ['questions'],
    });
    if (!interview) throw new NotFoundException('Interview not found');
    return interview;
  }

  async getQuestions(interviewId: string) {
    return this.questionRepo.find({
      where: { interview: { id: interviewId } },
      order: { order_index: 'ASC' },
    });
  }

  async endInterview(interviewId: string, userId: string) {
    const interview = await this.repo.findOne({
      where: { id: interviewId, user: { id: userId } },
    });
    if (!interview) throw new NotFoundException('Interview not found');

    const answers = await this.answersService.getByInterview(interviewId);
    const total = answers.reduce((acc, a) => acc + (a.score || 0), 0);
    const avg = answers.length ? total / answers.length : 0;

    interview.status = 'completed';
    interview.total_score = avg;
    await this.repo.save(interview);

    return interview;
  }

  async getResults(interviewId: string, userId: string) {
    const interview = await this.repo.findOne({
      where: { id: interviewId, user: { id: userId } },
    });
    if (!interview) throw new NotFoundException('Interview not found');

    const questions = await this.questionsService.getByInterview(interviewId);
    const answers = await this.answersService.getByInterview(interviewId);

    const mapped = questions.map((q) => {
      const answer = answers.find((a) => a.question.id === q.id);
      return {
        question: q.question_text,
        transcript: answer?.transcript ?? null,
        score: answer?.score ?? 0,
        feedback: answer?.feedback ?? null,
      };
    });

    const speechMetrics = answers.map((a) => ({
      wpm: a.wpm,
      pauses: a.pause_count,
      fillers: a.filler_count,
      duration: a.duration,
    }));

    return {
      interviewId,
      total_score: interview.total_score,
      questions: mapped,
      speechMetrics,
    };
  }
}
