import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase/supabase.service';
import { MembersModule } from './members/members.module';
import { PaymentsModule } from './payments/payments.module';
import { StripeService } from './stripe/stripe.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MembersModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService, StripeService],
})
export class AppModule {}
