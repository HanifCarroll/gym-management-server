import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { CreateInstructorDto, UpdateInstructorDto } from './dto';

@Controller('api/instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Post()
  async create(@Body() createInstructorDto: CreateInstructorDto) {
    return await this.instructorsService.create(createInstructorDto);
  }

  @Get()
  async findAll() {
    return await this.instructorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.instructorsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInstructorDto: UpdateInstructorDto,
  ) {
    return await this.instructorsService.update(+id, updateInstructorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.instructorsService.remove(+id);
  }
}
