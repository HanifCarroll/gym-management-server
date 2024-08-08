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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(private readonly memberService: MembersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Member successfully created',
    type: Member,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or email already exists',
  })
  create(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved all members',
    type: [Member],
  })
  findAll(): Promise<Member[]> {
    return this.memberService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a member by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved member',
    type: Member,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member not found',
  })
  @ApiParam({ name: 'id', type: 'string' })
  findById(@Param('id') id: string): Promise<Member> {
    return this.memberService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a member by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member successfully updated',
    type: Member,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or email already exists',
  })
  update(@Body() updateMemberDto: UpdateMemberDto): Promise<Member> {
    return this.memberService.update(updateMemberDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a member by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member successfully deleted',
    type: Member,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member not found',
  })
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string): Promise<Member> {
    return this.memberService.remove(id);
  }
}
