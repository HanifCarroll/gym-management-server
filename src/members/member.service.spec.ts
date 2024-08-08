import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { MemberRepository } from './member.repository';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member, MemberStatus } from './entities/member.entity';

describe('MembersService', () => {
  let service: MembersService;

  const mockMemberRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: MemberRepository,
          useValue: mockMemberRepository,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a member and return it', async () => {
      const createMemberDto: CreateMemberDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        phone: '1234567890',
        status: MemberStatus.Active,
      };
      const member: Member = {
        createdAt: '',
        updatedAt: '',
        id: '1',
        ...createMemberDto,
      };

      mockMemberRepository.create.mockResolvedValue(member);

      const result = await service.create(createMemberDto);
      expect(result).toEqual(member);
    });
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      const members: Member[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@gmail.com',
          phone: '1234567890',
          status: MemberStatus.Active,
          createdAt: '',
          updatedAt: '',
        },
      ];

      mockMemberRepository.findAll.mockResolvedValue(members);

      const result = await service.findAll();
      expect(result).toEqual(members);
    });
  });

  describe('update', () => {
    it('should update a member and return it', async () => {
      const updateMemberDto: UpdateMemberDto = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
      };
      const member: Member = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        phone: '1234567890',
        status: MemberStatus.Active,
        createdAt: '',
        updatedAt: '',
      };

      mockMemberRepository.update.mockResolvedValue(member);

      const result = await service.update(updateMemberDto);
      expect(result).toEqual(member);
    });
  });

  describe('remove', () => {
    it('should remove a member and return it', async () => {
      const member: Member = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        phone: '1234567890',
        status: MemberStatus.Active,
        createdAt: '',
        updatedAt: '',
      };

      mockMemberRepository.remove.mockResolvedValue(member);

      const result = await service.remove('1');
      expect(result).toEqual(member);
    });
  });
});
