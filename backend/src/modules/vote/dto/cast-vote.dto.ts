import { IsString, IsIn } from 'class-validator';

export class CastVoteDto {
  @IsString()
  @IsIn(['real', 'fake'])
  vote_type: string;
}
