import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { transformSupabaseResultToCamelCase } from '../utils';
import { CheckIn } from './entities/check-in.entity';

@Injectable()
export class CheckInRepository {
  private readonly tableName = 'check_in';

  constructor(private supabaseService: SupabaseService) {}

  private get db() {
    return this.supabaseService.getClient().from(this.tableName);
  }

  async create(memberId: string): Promise<CheckIn> {
    const { data, error } = await this.db
      .insert({ member_id: memberId })
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to create check-in: ${error.message}`,
      );
    }

    return transformSupabaseResultToCamelCase<CheckIn>(data);
  }

  async getHistory(memberId?: string): Promise<CheckIn[]> {
    let query = this.db
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
        `Failed to retrieve historical check-ins: ${error.message}`,
      );
    }

    return transformSupabaseResultToCamelCase<CheckIn[]>(data);
  }
}
