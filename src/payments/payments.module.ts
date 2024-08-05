import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, SupabaseService],
})
export class PaymentsModule {}
