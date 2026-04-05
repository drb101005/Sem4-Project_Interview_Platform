import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiClientService {
  private baseUrl: string;

  constructor(config: ConfigService) {
    this.baseUrl = config.get<string>('AI_SERVICE_BASE_URL') || 'http://localhost:8000';
  }

  async transcribe(audioUrl: string) {
    const _endpoint = `${this.baseUrl}/transcribe`;
    return {
      transcript: 'This is a mocked transcript placeholder while the AI service is integrated.',
      duration: 28,
    };
  }

  async metrics(audioUrl: string) {
    const _endpoint = `${this.baseUrl}/metrics`;
    return {
      wpm: 140,
      pause_count: 3,
      filler_count: 2,
      duration: 28,
    };
  }
}
