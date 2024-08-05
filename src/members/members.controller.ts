import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto, UpdateMemberDto } from './dto';

@Controller('api/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  async create(@Body() createMemberDto: CreateMemberDto) {
    return await this.membersService.create(createMemberDto);
  }

  @Get()
  async findAll() {
    return await this.membersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.membersService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return await this.membersService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.membersService.remove(+id);
  }
}
