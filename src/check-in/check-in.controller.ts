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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('check-in')
@Controller('check-in')
export class CheckInController {
  constructor(private checkInService: CheckInService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new check-in' })
  @ApiResponse({
    status: 201,
    description: 'Check-in successfully created',
    type: CheckIn,
  })
  async createCheckIn(@Body('memberId') memberId: string): Promise<CheckIn> {
    return this.checkInService.createCheckIn(memberId);
  }

  @Get('history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get historical check-ins' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved historical check-ins',
    type: [CheckIn],
  })
  async getHistoricalCheckIns(
    @Query('memberId') memberId: string,
  ): Promise<CheckIn[]> {
    return this.checkInService.getHistoricalCheckIns(memberId);
  }
}
