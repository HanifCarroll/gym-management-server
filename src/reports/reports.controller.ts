import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('attendance')
  async getAttendanceReport() {
    return await this.reportsService.getAttendanceReport();
  }

  @Get('revenue')
  async getRevenueReport() {
    return await this.reportsService.getRevenueReport();
  }
}
