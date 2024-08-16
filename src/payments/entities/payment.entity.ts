import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum PaymentStatus {
  SUCCESSFUL = 'Successful',
  FAILED = 'Failed',
  PENDING = 'Pending',
}

export interface DbPayment {
  id: string;
  member_id: string;
  amount: number;
  date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export class Payment {
  @ApiProperty({ description: 'The unique identifier of the payment' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'The member ID associated with the payment' })
  @IsString()
  @IsNotEmpty()
  memberId: string; // Foreign key to Member

  @ApiProperty({ description: 'The plan ID associated with the payment' })
  @IsString()
  @IsNotEmpty()
  planId: string; // Foreign key to MembershipPlan

  @ApiProperty({ description: 'The amount of the payment' })
  @IsNumber()
  amount: number; // Decimal

  @ApiProperty({ description: 'The date of the payment' })
  @IsString()
  @IsNotEmpty()
  date: string; // DateTime

  @ApiProperty({
    enum: PaymentStatus,
    description: 'The status of the payment',
  })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ description: 'The creation date of the payment record' })
  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @ApiProperty({ description: 'The last updated date of the payment record' })
  @IsString()
  @IsNotEmpty()
  updatedAt: string;
}
