import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [MembersController],
  providers: [MembersService, SupabaseService],
})
export class MembersModule {}
