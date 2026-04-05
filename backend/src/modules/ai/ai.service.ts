import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private client: OpenAI | null;

  constructor(private config: ConfigService) {
    const key = this.config.get<string>('OPENAI_API_KEY');
    this.client = key ? new OpenAI({ apiKey: key }) : null;
  }

  async generateQuestions(prompt: string): Promise<string[]> {
    if (!this.client) {
      return [
        'Tell me about a challenging project you worked on.',
        'Explain a time you had to debug a complex issue.',
        'How do you prioritize tasks when deadlines are tight?',
        'Describe a system you would design to scale to millions of users.',
        'What is a technical concept you recently learned?'
      ];
    }

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert interviewer. Respond only with valid JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
    });

    const content = response.choices[0]?.message?.content ?? '[]';
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.every((q) => typeof q === 'string')) {
        return parsed;
      }
    } catch {
      // fall through to fallback
    }

    return [
      'Walk me through your approach to solving a hard problem.',
      'What are your strengths and weaknesses as a candidate?',
      'Describe a time you improved performance in a project.',
      'How do you handle ambiguity in requirements?',
      'Tell me about a time you worked with a difficult stakeholder.'
    ];
  }
}
