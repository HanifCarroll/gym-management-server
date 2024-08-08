import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { MemberRepository } from './member.repository';

@Injectable()
export class MembersService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    // Validate email uniqueness
    const existingMember = await this.memberRepository.findByEmail(
      createMemberDto.email,
    );
    if (existingMember) {
      throw new BadRequestException(
        `Member with email ${createMemberDto.email} already exists`,
      );
    }

    return this.memberRepository.create(createMemberDto);
  }

  async findAll(): Promise<Member[]> {
    return this.memberRepository.findAll();
  }

  async findById(id: string): Promise<Member> {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async update(updateMemberDto: UpdateMemberDto): Promise<Member> {
    // Check if member exists
    await this.findById(updateMemberDto.id);

    // If email is being updated, check for uniqueness
    if (updateMemberDto.email) {
      const existingMember = await this.memberRepository.findByEmail(
        updateMemberDto.email,
      );
      if (existingMember && existingMember.id !== updateMemberDto.id) {
        throw new BadRequestException(
          `Member with email ${updateMemberDto.email} already exists`,
        );
      }
    }

    return this.memberRepository.update(updateMemberDto);
  }

  async remove(id: string): Promise<Member> {
    // Check if member exists
    await this.findById(id);

    return this.memberRepository.remove(id);
  }
}
