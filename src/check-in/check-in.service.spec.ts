import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { SupabaseService } from '../supabase/supabase.service';
import { MemberRepository } from '../members/member.repository';
import { CheckInRepository } from './check-in.repository';
import { Member, MemberStatus } from '../members/entities/member.entity';
import { CheckIn } from './entities/check-in.entity';

describe('CheckInService', () => {
  let service: CheckInService;
  let memberRepository: jest.Mocked<MemberRepository>;
  let checkInRepository: jest.Mocked<CheckInRepository>;

  beforeEach(async () => {
    const mockSupabaseService = {};
    const mockMemberRepository = {
      findById: jest.fn(),
    };
    const mockCheckInRepository = {
      create: jest.fn(),
      getHistory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckInService,
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: MemberRepository, useValue: mockMemberRepository },
        { provide: CheckInRepository, useValue: mockCheckInRepository },
      ],
    }).compile();

    service = module.get<CheckInService>(CheckInService);
    memberRepository = module.get(
      MemberRepository,
    ) as jest.Mocked<MemberRepository>;
    checkInRepository = module.get(
      CheckInRepository,
    ) as jest.Mocked<CheckInRepository>;
  });

  describe('createCheckIn', () => {
    it('should create a check-in for an active member', async () => {
      const memberId = 'active-member-id';
      const mockMember: Member = {
        createdAt: '',
        email: '',
        firstName: '',
        lastName: '',
        updatedAt: '',
        id: memberId,
        status: MemberStatus.Active,
      };
      const mockCheckIn: CheckIn = {
        dateTime: new Date().toString(),
        id: 'check-in-id',
        memberId: memberId,
        createdAt: new Date().toString(),
      };

      memberRepository.findById.mockResolvedValue(mockMember);
      checkInRepository.create.mockResolvedValue(mockCheckIn);

      const result = await service.createCheckIn(memberId);

      expect(memberRepository.findById).toHaveBeenCalledWith(memberId);
      expect(checkInRepository.create).toHaveBeenCalledWith(memberId);
      expect(result).toEqual(
        expect.objectContaining({
          id: 'check-in-id',
          dateTime: expect.any(String),
          memberId: memberId,
          createdAt: expect.any(String),
        }),
      );
    });

    it('should throw BadRequestException for inactive member', async () => {
      const memberId = 'inactive-member-id';
      const mockMember: Member = {
        createdAt: '',
        email: '',
        firstName: '',
        lastName: '',
        updatedAt: '',
        id: memberId,
        status: MemberStatus.Inactive,
      };

      memberRepository.findById.mockResolvedValue(mockMember);

      await expect(service.createCheckIn(memberId)).rejects.toThrow(
        BadRequestException,
      );
      expect(memberRepository.findById).toHaveBeenCalledWith(memberId);
      expect(checkInRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getHistoricalCheckIns', () => {
    it('should return historical check-ins for a specific member', async () => {
      const memberId = 'member-1';
      const mockCheckIns: CheckIn[] = [
        {
          id: 'check-in-1',
          memberId: memberId,
          dateTime: new Date().toString(),
          createdAt: new Date().toString(),
        },
        {
          id: 'check-in-2',
          memberId: 'member-2',
          dateTime: new Date().toString(),
          createdAt: new Date().toString(),
        },
      ];

      checkInRepository.getHistory.mockResolvedValue(mockCheckIns);

      const result = await service.getHistoricalCheckIns(memberId);

      expect(checkInRepository.getHistory).toHaveBeenCalledWith(memberId);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'check-in-1',
            memberId,
            dateTime: expect.any(String),
            createdAt: expect.any(String),
          }),
        ]),
      );
    });

    it('should return all historical check-ins when no memberId is provided', async () => {
      const mockCheckIns: CheckIn[] = [
        {
          id: 'check-in-1',
          memberId: 'member-1',
          dateTime: new Date().toString(),
          createdAt: new Date().toString(),
        },
        {
          id: 'check-in-2',
          memberId: 'member-2',
          dateTime: new Date().toString(),
          createdAt: new Date().toString(),
        },
      ];

      checkInRepository.getHistory.mockResolvedValue(mockCheckIns);

      const result = await service.getHistoricalCheckIns();

      expect(checkInRepository.getHistory).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'check-in-1',
            memberId: 'member-1',
            dateTime: expect.any(String),
            createdAt: expect.any(String),
          }),
          expect.objectContaining({
            id: 'check-in-2',
            memberId: 'member-2',
            dateTime: expect.any(String),
            createdAt: expect.any(String),
          }),
        ]),
      );
    });
  });
});
