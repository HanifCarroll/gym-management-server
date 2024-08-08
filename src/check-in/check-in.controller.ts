import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { CheckIn } from './entities/check-in.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('check-in')
@Controller('check-in')
export class CheckInController {
  constructor(private checkInService: CheckInService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCheckIn(@Body('memberId') memberId: string): Promise<CheckIn> {
    return this.checkInService.createCheckIn(memberId);
  }

  @Get('history')
  @HttpCode(HttpStatus.OK)
  async getHistoricalCheckIns(
    @Query('memberId') memberId: string,
  ): Promise<CheckIn[]> {
    return this.checkInService.getHistoricalCheckIns(memberId);
  }
}
