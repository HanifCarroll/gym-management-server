import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, SupabaseService],
})
export class NotificationsModule {}
