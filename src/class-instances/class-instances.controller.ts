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
import { ClassInstancesService } from './class-instances.service';
import { CreateClassInstanceDto, UpdateClassInstanceDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('class-schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/class-schedules')
export class ClassInstancesController {
  constructor(private readonly classSchedulesService: ClassInstancesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new class schedule' })
  @ApiResponse({
    status: 201,
    description: 'The class schedule has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createClassScheduleDto: CreateClassInstanceDto) {
    return this.classSchedulesService.create(createClassScheduleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all class schedules' })
  @ApiResponse({ status: 200, description: 'Return all class schedules.' })
  findAll() {
    return this.classSchedulesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single class schedule' })
  @ApiResponse({ status: 200, description: 'Return the class schedule.' })
  @ApiResponse({ status: 404, description: 'Class schedule not found.' })
  findOne(@Param('id') id: string) {
    return this.classSchedulesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a class schedule' })
  @ApiResponse({
    status: 200,
    description: 'The class schedule has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Class schedule not found.' })
  update(
    @Param('id') id: string,
    @Body() updateClassScheduleDto: UpdateClassInstanceDto,
  ) {
    return this.classSchedulesService.update(+id, updateClassScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a class schedule' })
  @ApiResponse({
    status: 200,
    description: 'The class schedule has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Class schedule not found.' })
  remove(@Param('id') id: string) {
    return this.classSchedulesService.remove(+id);
  }
}
