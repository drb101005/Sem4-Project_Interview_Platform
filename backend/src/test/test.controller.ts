import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Post('tts')
  tts(@Body('text') text?: string) {
    return this.testService.tts(text);
  }

  @Post('whisper')
  @UseInterceptors(FileInterceptor('file'))
  whisper(@UploadedFile() file?: Express.Multer.File) {
    return this.testService.whisper(file);
  }
}
