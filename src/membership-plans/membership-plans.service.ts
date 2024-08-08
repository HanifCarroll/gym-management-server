import { Injectable } from '@nestjs/common';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { MembershipPlan } from './entities/membership-plan.entity';
import { MembershipPlanRepository } from './membership-plans.repository';

@Injectable()
export class MembershipPlansService {
  constructor(
    private readonly membershipPlanRepository: MembershipPlanRepository,
  ) {}

  async create(
    createMembershipPlanDto: CreateMembershipPlanDto,
  ): Promise<MembershipPlan> {
    return this.membershipPlanRepository.create(createMembershipPlanDto);
  }

  async findAll(): Promise<MembershipPlan[]> {
    return this.membershipPlanRepository.findAll();
  }

  async findOne(id: string): Promise<MembershipPlan> {
    return this.membershipPlanRepository.findOne(id);
  }

  async update(
    id: string,
    updateMembershipPlanDto: UpdateMembershipPlanDto,
  ): Promise<MembershipPlan> {
    return this.membershipPlanRepository.update(id, updateMembershipPlanDto);
  }

  async remove(id: string): Promise<MembershipPlan> {
    return this.membershipPlanRepository.remove(id);
  }
}
