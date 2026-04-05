import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';
import { AiClientService } from './ai-client.service';

@Module({
  providers: [AiService, AiClientService, ConfigService],
  exports: [AiService, AiClientService],
})
export class AiModule {}
