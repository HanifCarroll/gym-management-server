import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase/supabase.service';
import { MembersModule } from './members/members.module';
import { PaymentsModule } from './payments/payments.module';
import { StripeService } from './stripe/stripe.service';
import { MembershipPlansModule } from './membership-plans/membership-plans.module';
import { CheckInModule } from './check-in/check-in.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MembersModule,
    PaymentsModule,
    MembershipPlansModule,
    CheckInModule,
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService, StripeService],
})
export class AppModule {}
