import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { transformSupabaseResultToCamelCase } from '../utils';
import { CheckIn } from './entities/check-in.entity';
import { MemberRepository } from '../members/member.repository';
import { CheckInRepository } from './check-in.repository';

@Injectable()
export class CheckInService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly checkInRepository: CheckInRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  async createCheckIn(memberId: string): Promise<CheckIn> {
    // Check if the member exists and is active
    const memberData = await this.memberRepository.findById(memberId);
    if (memberData.status !== 'Active') {
      throw new BadRequestException('Member is not active');
    }

    // Create the check-in
    const newCheckIn = await this.checkInRepository.create(memberId);

    return transformSupabaseResultToCamelCase<CheckIn>(newCheckIn);
  }

  async getHistoricalCheckIns(memberId?: string): Promise<CheckIn[]> {
    const checkIns = await this.checkInRepository.getHistory(memberId);

    return transformSupabaseResultToCamelCase<CheckIn[]>(checkIns);
  }
}
