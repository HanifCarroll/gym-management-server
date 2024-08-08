import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMemberDto } from './create-member.dto';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  @ApiProperty({ description: 'The unique identifier of the member' })
  @IsNotEmpty()
  @IsString()
  id: string;
}
