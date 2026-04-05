import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { InterviewsService } from './interviews.service';
import { StartInterviewDto } from './dto.start';

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(private interviewsService: InterviewsService) {}

  @Post('start')
  start(@CurrentUser() user: { id: string }, @Body() dto: StartInterviewDto) {
    return this.interviewsService.startInterview(user.id, dto);
  }

  @Get()
  list(@CurrentUser() user: { id: string }) {
    return this.interviewsService.listForUser(user.id);
  }

  @Get(':id')
  getOne(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.interviewsService.getInterview(id, user.id);
  }

  @Post(':id/end')
  end(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.interviewsService.endInterview(id, user.id);
  }

  @Get(':id/results')
  results(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.interviewsService.getResults(id, user.id);
  }
}
