import { Injectable } from '@nestjs/common';

const DEFAULT_PLACEHOLDER_AUDIO =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';

@Injectable()
export class TestService {
  private readonly placeholderAudioUrl =
    process.env.TEST_TTS_AUDIO_URL || DEFAULT_PLACEHOLDER_AUDIO;

  tts(text?: string) {
    return {
      audioUrl: this.placeholderAudioUrl,
      text: text || '',
    };
  }

  whisper(_file?: Express.Multer.File) {
    return {
      transcript: 'this is a test transcription',
    };
  }
}
