import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export interface DbMembershipPlan {
  id: string;
  name: string;
  duration: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export class MembershipPlan {
  @ApiProperty({ description: 'The unique identifier of the membership plan' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'The name of the membership plan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The duration of the membership plan in months' })
  @IsNumber()
  duration: number; // In months

  @ApiProperty({ description: 'The price of the membership plan' })
  @IsNumber()
  price: number; // Decimal

  @ApiProperty({
    description: 'The creation date of the membership plan record',
  })
  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @ApiProperty({
    description: 'The last updated date of the membership plan record',
  })
  @IsString()
  @IsNotEmpty()
  updatedAt: string;
}
