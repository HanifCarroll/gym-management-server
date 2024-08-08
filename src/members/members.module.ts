import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MemberRepository } from './member.repository';

@Module({
  controllers: [MembersController],
  providers: [MembersService, MemberRepository],
})
export class MembersModule {}
