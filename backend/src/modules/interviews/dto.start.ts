import { IsIn, IsOptional, IsString } from 'class-validator';

export class StartInterviewDto {
  @IsString()
  @IsIn(['Tech', 'HR'])
  type!: string;

  @IsString()
  difficulty!: string;

  @IsString()
  resume_text!: string;

  @IsOptional()
  @IsString()
  job_description?: string;
}
