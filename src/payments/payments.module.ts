import { Module } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { PaymentController } from './payments.controller';
import { SupabaseService } from '../supabase/supabase.service';
import { StripeService } from '../stripe/stripe.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, SupabaseService, StripeService],
})
export class PaymentsModule {}
