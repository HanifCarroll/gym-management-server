import { Module } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { PaymentController } from './payments.controller';
import { StripeService } from '../stripe/stripe.service';
import { MemberRepository } from '../members/member.repository';
import { PaymentRepository } from './payments.repository';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
    MemberRepository,
    SupabaseService,
    StripeService,
  ],
})
export class PaymentsModule {}
