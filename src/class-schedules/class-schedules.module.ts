import { Module } from '@nestjs/common';
import { ClassSchedulesController } from './class-schedules.controller';
import { ClassSchedulesService } from './class-schedules.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [ClassSchedulesController],
  providers: [ClassSchedulesService, SupabaseService],
})
export class ClassSchedulesModule {}
