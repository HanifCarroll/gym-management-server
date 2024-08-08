import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { MemberRepository } from './member.repository';

@Injectable()
export class MembersService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberRepository.create(createMemberDto);
  }

  async findAll(): Promise<Member[]> {
    return this.memberRepository.findAll();
  }

  async update(updateMemberDto: UpdateMemberDto): Promise<Member> {
    return this.memberRepository.update(updateMemberDto);
  }

  async remove(id: string): Promise<Member> {
    return this.memberRepository.remove(id);
  }
}
