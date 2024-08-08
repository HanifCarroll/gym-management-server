import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MemberStatus } from '../entities/member.entity';

export class CreateMemberDto {
  @ApiProperty({ description: 'The first name of the member' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'The last name of the member' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'The email address of the member' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The phone number of the member' })
  @IsString()
  phone: string;

  @ApiProperty({
    enum: MemberStatus,
    description: 'The status of the member',
    default: MemberStatus.Inactive,
  })
  @IsEnum(MemberStatus)
  status: MemberStatus = MemberStatus.Inactive;
}
