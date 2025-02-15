import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  questionText: string;

  @IsArray()
  options: string[];

  @IsNumber()
  correctOptionIndex: number;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  difficulty?: string;
}
