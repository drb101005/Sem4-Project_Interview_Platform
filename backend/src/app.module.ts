import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { AnswersModule } from './modules/answers/answers.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { AdminModule } from './modules/admin/admin.module';
import { AiModule } from './modules/ai/ai.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { User } from './entities/user.entity';
import { Interview } from './entities/interview.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { TestModule } from './test/test.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...(process.env.SKIP_DB === 'true'
      ? [TestModule]
      : [
          TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              type: 'postgres',
              url: config.get<string>('DATABASE_URL'),
              entities: [User, Interview, Question, Answer],
              synchronize: true,
              ssl: config.get<string>('DATABASE_SSL') === 'true' ? { rejectUnauthorized: false } : false,
            }),
          }),
          AuthModule,
          UsersModule,
          InterviewsModule,
          QuestionsModule,
          AnswersModule,
          WebsocketModule,
          AdminModule,
          AiModule,
          CloudinaryModule,
          TestModule,
        ]),
  ],
})
export class AppModule {}
