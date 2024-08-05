import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase/supabase.service';
import { MembersModule } from './members/members.module';
import { ClassesModule } from './classes/classes.module';
import { InstructorsModule } from './instructors/instructors.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PaymentsModule } from './payments/payments.module';
import { MembershipPlansModule } from './membership-plans/membership-plans.module';
import { ClassSchedulesModule } from './class-schedules/class-schedules.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MembersModule,
    ClassesModule,
    InstructorsModule,
    AttendanceModule,
    PaymentsModule,
    MembershipPlansModule,
    ClassSchedulesModule,
    NotificationsModule,
    ReportsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule {}
