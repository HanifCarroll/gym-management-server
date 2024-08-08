import { IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiatePaymentDto {
  @ApiProperty({ description: 'The ID of the member making the payment' })
  @IsString()
  memberId: string;

  @ApiProperty({ description: 'The amount of the payment' })
  @IsNumber()
  @IsPositive()
  amount: number;
}
