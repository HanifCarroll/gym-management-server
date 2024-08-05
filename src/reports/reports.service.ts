import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ReportsService {
  private readonly supabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabaseClient = this.supabaseService.getClient();
  }

  async getAttendanceReport() {
    const { data, error } = await this.supabaseClient
      .from('attendance')
      .select('member_id, class_id, attended, created_at');

    if (error) throw error;
    return data;
  }

  async getRevenueReport() {
    const { data, error } = await this.supabaseClient
      .from('payments')
      .select('amount, payment_date');

    if (error) throw error;
    return data;
  }
}
