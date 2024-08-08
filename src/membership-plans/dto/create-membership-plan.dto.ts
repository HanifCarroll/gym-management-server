import { IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMembershipPlanDto {
  @ApiProperty({ description: 'The name of the membership plan' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The duration of the membership plan in months' })
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiProperty({ description: 'The price of the membership plan' })
  @IsNumber()
  @IsPositive()
  price: number;
}
