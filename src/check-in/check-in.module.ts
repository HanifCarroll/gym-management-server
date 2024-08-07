import { Module } from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { CheckInController } from './check-in.controller';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [CheckInController],
  providers: [CheckInService, SupabaseService],
})
export class CheckInModule {}
