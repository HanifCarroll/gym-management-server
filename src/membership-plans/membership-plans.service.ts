import { BadRequestException, Injectable } from '@nestjs/common';
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
    const existingPlan = await this.membershipPlanRepository.findByName(
      createMembershipPlanDto.name,
    );
    if (existingPlan) {
      throw new BadRequestException(
        `Membership plan with name "${createMembershipPlanDto.name}" already exists`,
      );
    }

    if (createMembershipPlanDto.duration <= 0) {
      throw new BadRequestException(
        'Membership plan duration must be greater than zero',
      );
    }

    if (createMembershipPlanDto.price <= 0) {
      throw new BadRequestException(
        'Membership plan price must be greater than zero',
      );
    }

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
    const existingPlan = await this.membershipPlanRepository.findOne(id);

    if (
      updateMembershipPlanDto.name &&
      updateMembershipPlanDto.name !== existingPlan.name
    ) {
      const planWithSameName = await this.membershipPlanRepository.findByName(
        updateMembershipPlanDto.name,
      );
      if (planWithSameName) {
        throw new BadRequestException(
          `Membership plan with name "${updateMembershipPlanDto.name}" already exists`,
        );
      }
    }

    if (
      updateMembershipPlanDto.duration !== undefined &&
      updateMembershipPlanDto.duration <= 0
    ) {
      throw new BadRequestException(
        'Membership plan duration must be greater than zero',
      );
    }

    if (
      updateMembershipPlanDto.price !== undefined &&
      updateMembershipPlanDto.price <= 0
    ) {
      throw new BadRequestException(
        'Membership plan price must be greater than zero',
      );
    }

    return this.membershipPlanRepository.update(id, updateMembershipPlanDto);
  }

  async remove(id: string): Promise<MembershipPlan> {
    return this.membershipPlanRepository.remove(id);
  }
}
