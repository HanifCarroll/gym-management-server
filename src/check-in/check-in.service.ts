import { BadRequestException, Injectable } from '@nestjs/common';
import { transformSupabaseResultToCamelCase } from '../utils';
import { CheckIn } from './entities/check-in.entity';
import { MemberRepository } from '../members/member.repository';
import { CheckInRepository } from './check-in.repository';

@Injectable()
export class CheckInService {
  constructor(
    private readonly checkInRepository: CheckInRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  async createCheckIn(memberId: string): Promise<CheckIn> {
    // Check if the member exists and is active
    const memberData = await this.memberRepository.findById(memberId);
    if (memberData.status !== 'Active') {
      throw new BadRequestException('Member is not active');
    }

    const newCheckIn = await this.checkInRepository.create(memberId);

    return transformSupabaseResultToCamelCase<CheckIn>(newCheckIn);
  }

  async getHistoricalCheckIns(memberId?: string): Promise<CheckIn[]> {
    return this.checkInRepository.getHistory(memberId);
  }
}
