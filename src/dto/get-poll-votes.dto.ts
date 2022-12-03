import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetPollVotesDto {
  @IsNotEmpty()
  @Transform(({ value }) => console.log(value))
  @IsString()
  public readonly vote: string;

  @IsNotEmpty()
  @IsString()
  public readonly answer: string;
}
