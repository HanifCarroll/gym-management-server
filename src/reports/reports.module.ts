import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, SupabaseService],
})
export class ReportsModule {}
