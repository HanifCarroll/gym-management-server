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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

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
    status: HttpStatus.CREATED,
    description: 'Membership plan successfully created',
    type: MembershipPlan,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or duplicate plan name',
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
    status: HttpStatus.OK,
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
    status: HttpStatus.OK,
    description: 'Successfully retrieved the membership plan',
    type: MembershipPlan,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Membership plan not found',
  })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string): Promise<MembershipPlan> {
    return this.membershipPlansService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a membership plan by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Membership plan successfully updated',
    type: MembershipPlan,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Membership plan not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or duplicate plan name',
  })
  @ApiParam({ name: 'id', type: 'string' })
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
    status: HttpStatus.OK,
    description: 'Membership plan successfully deleted',
    type: MembershipPlan,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Membership plan not found',
  })
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string): Promise<MembershipPlan> {
    return this.membershipPlansService.remove(id);
  }
}
