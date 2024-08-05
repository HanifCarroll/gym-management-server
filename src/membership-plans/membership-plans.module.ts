import { Module } from '@nestjs/common';
import { MembershipPlansController } from './membership-plans.controller';
import { MembershipPlansService } from './membership-plans.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [MembershipPlansController],
  providers: [MembershipPlansService, SupabaseService],
})
export class MembershipPlansModule {}
