import { Module } from '@nestjs/common';
import { MembershipPlansService } from './membership-plans.service';
import { MembershipPlansController } from './membership-plans.controller';
import { MembershipPlanRepository } from './membership-plans.repository';

@Module({
  controllers: [MembershipPlansController],
  providers: [MembershipPlansService, MembershipPlanRepository],
})
export class MembershipPlansModule {}
