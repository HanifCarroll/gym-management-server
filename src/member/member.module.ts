import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [MemberController],
  providers: [MemberService, SupabaseService],
})
export class MemberModule {}
