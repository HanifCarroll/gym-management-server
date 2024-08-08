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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(private readonly memberService: MembersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({
    status: 201,
    description: 'Member successfully created',
    type: Member,
  })
  create(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all members',
    type: [Member],
  })
  findAll(): Promise<Member[]> {
    return this.memberService.findAll();
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a member by ID' })
  @ApiResponse({
    status: 200,
    description: 'Member successfully updated',
    type: Member,
  })
  update(@Body() updateMemberDto: UpdateMemberDto): Promise<Member> {
    return this.memberService.update(updateMemberDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a member by ID' })
  @ApiResponse({
    status: 200,
    description: 'Member successfully deleted',
    type: Member,
  })
  remove(@Param('id') id: string): Promise<Member> {
    return this.memberService.remove(id);
  }
}
