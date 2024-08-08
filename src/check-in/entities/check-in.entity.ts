import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface DbCheckIn {
  id: string;
  member_id: string;
  date_time: string;
  created_at: string;
}

export class CheckIn {
  @ApiProperty({ description: 'The unique identifier of the check-in' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'The member ID associated with the check-in' })
  @IsString()
  @IsNotEmpty()
  memberId: string; // Foreign key to Member

  @ApiProperty({ description: 'The date and time of the check-in' })
  @IsString()
  @IsNotEmpty()
  dateTime: string; // DateTime

  @ApiProperty({ description: 'The creation date of the check-in record' })
  @IsString()
  @IsNotEmpty()
  createdAt: string;
}
