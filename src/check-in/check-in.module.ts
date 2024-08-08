import { Module } from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { CheckInController } from './check-in.controller';
import { MemberRepository } from '../members/member.repository';
import { CheckInRepository } from './check-in.repository';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [CheckInController],
  providers: [
    CheckInService,
    MemberRepository,
    CheckInRepository,
    SupabaseService,
  ],
})
export class CheckInModule {}
