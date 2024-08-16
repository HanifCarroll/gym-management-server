import { Module } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { PaymentController } from './payments.controller';
import { StripeService } from '../stripe/stripe.service';
import { MemberRepository } from '../members/member.repository';
import { PaymentRepository } from './payments.repository';
import { SupabaseService } from '../supabase/supabase.service';
import { MembershipPlanRepository } from '../membership-plans/membership-plans.repository';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
    MemberRepository,
    MembershipPlanRepository,
    SupabaseService,
    StripeService,
  ],
})
export class PaymentsModule {}
