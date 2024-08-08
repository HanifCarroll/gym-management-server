import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MembershipPlansService } from './membership-plans.service';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { MembershipPlan } from './entities/membership-plan.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('membership-plans')
@Controller('membership-plans')
export class MembershipPlansController {
  constructor(
    private readonly membershipPlansService: MembershipPlansService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createMembershipPlanDto: CreateMembershipPlanDto,
  ): Promise<MembershipPlan> {
    return this.membershipPlansService.create(createMembershipPlanDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<MembershipPlan[]> {
    return this.membershipPlansService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<MembershipPlan> {
    return this.membershipPlansService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateMembershipPlanDto: UpdateMembershipPlanDto,
  ): Promise<MembershipPlan> {
    return this.membershipPlansService.update(id, updateMembershipPlanDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string): Promise<MembershipPlan> {
    return this.membershipPlansService.remove(id);
  }
}
