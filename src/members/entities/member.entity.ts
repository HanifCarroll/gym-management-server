import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum MemberStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
}

export interface DbMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: MemberStatus;
  created_at: string;
  updated_at: string;
}

export class Member {
  @ApiProperty({ description: 'The unique identifier of the member' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'The first name of the member' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'The last name of the member' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'The email address of the member' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The phone number of the member',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ enum: MemberStatus, description: 'The status of the member' })
  @IsEnum(MemberStatus)
  status: MemberStatus;

  @ApiProperty({ description: 'The creation date of the member record' })
  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @ApiProperty({ description: 'The last updated date of the member record' })
  @IsString()
  @IsNotEmpty()
  updatedAt: string;
}
