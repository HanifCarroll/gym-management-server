import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { SupabaseService } from '../supabase/supabase.service';
import { ClassInstancesService } from '../class-instances/class-instances.service';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService, SupabaseService, ClassInstancesService],
})
export class ClassesModule {}
