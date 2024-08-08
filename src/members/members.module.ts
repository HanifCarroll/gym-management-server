import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MemberRepository } from './member.repository';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [MembersController],
  providers: [MembersService, MemberRepository, SupabaseService],
})
export class MembersModule {}
