import { Module } from '@nestjs/common';
import { MembershipPlansService } from './membership-plans.service';
import { MembershipPlansController } from './membership-plans.controller';
import { MembershipPlanRepository } from './membership-plans.repository';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [MembershipPlansController],
  providers: [
    MembershipPlansService,
    MembershipPlanRepository,
    SupabaseService,
  ],
})
export class MembershipPlansModule {}
