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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('membership-plans')
@Controller('membership-plans')
export class MembershipPlansController {
  constructor(
    private readonly membershipPlansService: MembershipPlansService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new membership plan' })
  @ApiResponse({
    status: 201,
    description: 'Membership plan successfully created',
    type: MembershipPlan,
  })
  create(
    @Body() createMembershipPlanDto: CreateMembershipPlanDto,
  ): Promise<MembershipPlan> {
    return this.membershipPlansService.create(createMembershipPlanDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all membership plans' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all membership plans',
    type: [MembershipPlan],
  })
  findAll(): Promise<MembershipPlan[]> {
    return this.membershipPlansService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a membership plan by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the membership plan',
    type: MembershipPlan,
  })
  findOne(@Param('id') id: string): Promise<MembershipPlan> {
    return this.membershipPlansService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a membership plan by ID' })
  @ApiResponse({
    status: 200,
    description: 'Membership plan successfully updated',
    type: MembershipPlan,
  })
  update(
    @Param('id') id: string,
    @Body() updateMembershipPlanDto: UpdateMembershipPlanDto,
  ): Promise<MembershipPlan> {
    return this.membershipPlansService.update(id, updateMembershipPlanDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a membership plan by ID' })
  @ApiResponse({
    status: 200,
    description: 'Membership plan successfully deleted',
    type: MembershipPlan,
  })
  remove(@Param('id') id: string): Promise<MembershipPlan> {
    return this.membershipPlansService.remove(id);
  }
}
