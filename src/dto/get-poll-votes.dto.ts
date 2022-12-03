import { IsNotEmpty, IsString } from 'class-validator';

export class GetPollVotesDto {
  @IsNotEmpty()
  @IsString()
  public readonly vote: string;

  @IsNotEmpty()
  @IsString()
  public readonly answer: string;
}
