import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MembershipPlansService } from './membership-plans.service';
import { CreateMembershipPlanDto, UpdateMembershipPlanDto } from './dto';

@Controller('api/membership-plans')
export class MembershipPlansController {
  constructor(
    private readonly membershipPlansService: MembershipPlansService,
  ) {}

  @Post()
  async create(@Body() createMembershipPlanDto: CreateMembershipPlanDto) {
    return await this.membershipPlansService.create(createMembershipPlanDto);
  }

  @Get()
  async findAll() {
    return await this.membershipPlansService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.membershipPlansService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMembershipPlanDto: UpdateMembershipPlanDto,
  ) {
    return await this.membershipPlansService.update(
      +id,
      updateMembershipPlanDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.membershipPlansService.remove(+id);
  }
}
