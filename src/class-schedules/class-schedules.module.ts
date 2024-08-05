import { Module } from '@nestjs/common';
import { ClassSchedulesController } from './class-schedules.controller';
import { ClassSchedulesService } from './class-schedules.service';

@Module({
  controllers: [ClassSchedulesController],
  providers: [ClassSchedulesService]
})
export class ClassSchedulesModule {}
