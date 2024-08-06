import { Module } from '@nestjs/common';
import { ClassInstancesController } from './class-instances.controller';
import { ClassInstancesService } from './class-instances.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [ClassInstancesController],
  providers: [ClassInstancesService, SupabaseService],
})
export class ClassInstancesModule {}
