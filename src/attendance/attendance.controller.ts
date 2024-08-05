import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, UpdateAttendanceDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new attendance record' })
  @ApiResponse({
    status: 201,
    description: 'The attendance record has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance records' })
  @ApiResponse({ status: 200, description: 'Return all attendance records.' })
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single attendance record' })
  @ApiResponse({ status: 200, description: 'Return the attendance record.' })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an attendance record' })
  @ApiResponse({
    status: 200,
    description: 'The attendance record has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(+id, updateAttendanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attendance record' })
  @ApiResponse({
    status: 200,
    description: 'The attendance record has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(+id);
  }

  @Get('member/:memberId')
  @ApiOperation({ summary: 'Get attendance records for a specific member' })
  @ApiResponse({
    status: 200,
    description: 'Return attendance records for the member.',
  })
  getAttendanceByMember(@Param('memberId') memberId: string) {
    return this.attendanceService.getAttendanceByMember(+memberId);
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Get attendance records for a specific class' })
  @ApiResponse({
    status: 200,
    description: 'Return attendance records for the class.',
  })
  getAttendanceByClass(@Param('classId') classId: string) {
    return this.attendanceService.getAttendanceByClass(+classId);
  }

  @Get('report')
  @ApiOperation({ summary: 'Generate attendance report for a date range' })
  @ApiResponse({ status: 200, description: 'Return the attendance report.' })
  getAttendanceReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.attendanceService.getAttendanceReport(startDate, endDate);
  }
}
