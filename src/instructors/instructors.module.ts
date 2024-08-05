import { Module } from '@nestjs/common';
import { InstructorsController } from './instructors.controller';
import { InstructorsService } from './instructors.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [InstructorsController],
  providers: [InstructorsService, SupabaseService],
})
export class InstructorsModule {}
