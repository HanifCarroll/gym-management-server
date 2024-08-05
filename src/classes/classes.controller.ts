import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto, UpdateClassDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(+id, updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.remove(+id);
  }

  @Get('instructor/:instructorId')
  findByInstructor(@Param('instructorId') instructorId: string) {
    return this.classesService.findByInstructor(+instructorId);
  }
}
