import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { transformSupabaseResultToCamelCase } from '../utils';
import { CheckIn } from './entities/check-in.entity';

@Injectable()
export class CheckInRepository {
  constructor(private supabaseService: SupabaseService) {}

  async create(memberId: string): Promise<CheckIn> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('check_in')
      .insert({ member_id: memberId })
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException('Failed to create check-in');
    }

    return transformSupabaseResultToCamelCase<CheckIn>(data);
  }

  async getHistory(memberId?: string): Promise<CheckIn[]> {
    let query = this.supabaseService
      .getClient()
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

    if (memberId) {
      query = query.eq('member_id', memberId);
    }

    const { data, error } = await query;

    if (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve historical check-ins',
      );
    }

    return transformSupabaseResultToCamelCase<CheckIn[]>(data);
  }
}
