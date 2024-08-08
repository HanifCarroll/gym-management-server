import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { transformSupabaseResultToCamelCase } from '../utils';

@Injectable()
export class CheckInService {
  constructor(private supabaseService: SupabaseService) {}

  async createCheckIn(memberId: string): Promise<any> {
    const supabase = this.supabaseService.getClient();

    // Check if the member exists and is active
    const { data: memberData, error: memberError } = await supabase
      .from('member')
      .select('id, status')
      .eq('id', memberId)
      .single();

    if (memberError || !memberData) {
      throw new NotFoundException('Member not found');
    }

    if (memberData.status !== 'Active') {
      throw new BadRequestException('Member is not active');
    }

    // Create the check-in
    const { data, error } = await supabase
      .from('check_in')
      .insert({ member_id: memberId })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to create check-in');
    }

    return transformSupabaseResultToCamelCase(data);
  }

  async getHistoricalCheckIns(memberId?: string): Promise<any[]> {
    const supabase = this.supabaseService.getClient();
    let query = supabase
      .from('check_in')
      .select(
        `
        *,
        member:member_id (
          id,
          first_name,
          last_name,
          email
        )
      `,
      )
      .order('date_time', { ascending: false });

    // If given a memberId, restrict the query to records with that memberId.
    if (memberId) {
      query = query.eq('member_id', memberId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error('Failed to retrieve historical check-ins');
    }

    return transformSupabaseResultToCamelCase(data);
  }
}
