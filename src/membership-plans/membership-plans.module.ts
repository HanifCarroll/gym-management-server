import { Module } from '@nestjs/common';
import { MembershipPlansController } from './membership-plans.controller';
import { MembershipPlansService } from './membership-plans.service';

@Module({
  controllers: [MembershipPlansController],
  providers: [MembershipPlansService]
})
export class MembershipPlansModule {}
