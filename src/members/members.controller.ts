import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(private readonly memberService: MembersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Member[]> {
    return this.memberService.findAll();
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Body() updateMemberDto: UpdateMemberDto): Promise<Member> {
    return this.memberService.update(updateMemberDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string): Promise<Member> {
    return this.memberService.remove(id);
  }
}
