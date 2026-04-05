import { Injectable } from '@nestjs/common';
import { AiClientService } from '../ai/ai-client.service';

@Injectable()
export class ProcessingService {
  constructor(private aiClient: AiClientService) {}

  async processAnswer(audioUrl: string) {
    const transcription = await this.aiClient.transcribe(audioUrl);
    const metrics = await this.aiClient.metrics(audioUrl);
    const evaluation = this.evaluateAnswerPlaceholder(transcription.transcript);

    return {
      transcript: transcription.transcript,
      metrics,
      evaluation,
    };
  }

  private evaluateAnswerPlaceholder(transcript: string) {
    // Placeholder only: final evaluation prompts are intentionally not defined.
    const score = Math.min(100, Math.max(50, transcript.length % 100));
    return {
      score,
      feedback: 'Mocked feedback while AI evaluation logic is being finalized.',
      improved_answer: 'Mocked improved answer placeholder.',
    };
  }
}
