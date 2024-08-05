import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [MembersController],
  providers: [MembersService, SupabaseService],
})
export class MembersModule {}
