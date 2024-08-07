import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum MemberStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
}

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsEnum(MemberStatus)
  status: MemberStatus = MemberStatus.Inactive;
}
