import { Test, TestingModule } from '@nestjs/testing';
import { MembershipPlansService } from './membership-plans.service';
import { MembershipPlanRepository } from './membership-plans.repository';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { MembershipPlan } from './entities/membership-plan.entity';

describe('MembershipPlansService', () => {
  let service: MembershipPlansService;

  const mockMembershipPlanRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipPlansService,
        {
          provide: MembershipPlanRepository,
          useValue: mockMembershipPlanRepository,
        },
      ],
    }).compile();

    service = module.get<MembershipPlansService>(MembershipPlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a membership plan and return it', async () => {
      const createMembershipPlanDto: CreateMembershipPlanDto = {
        duration: 1,
        name: 'Basic Plan',
        price: 10,
      };
      const membershipPlan: MembershipPlan = {
        id: '1',
        createdAt: '',
        updatedAt: '',
        ...createMembershipPlanDto,
      };

      mockMembershipPlanRepository.create.mockResolvedValue(membershipPlan);

      const result = await service.create(createMembershipPlanDto);
      expect(result).toEqual(membershipPlan);
    });
  });

  describe('findAll', () => {
    it('should return an array of membership plans', async () => {
      const membershipPlans: MembershipPlan[] = [
        {
          id: '1',
          name: 'Basic Plan',
          duration: 1,
          price: 10,
          createdAt: '',
          updatedAt: '',
        },
        {
          id: '2',
          name: 'Premium Plan',
          duration: 1,
          price: 20,
          createdAt: '',
          updatedAt: '',
        },
      ];

      mockMembershipPlanRepository.findAll.mockResolvedValue(membershipPlans);

      const result = await service.findAll();
      expect(result).toEqual(membershipPlans);
    });
  });

  describe('findOne', () => {
    it('should return a membership plan by ID', async () => {
      const membershipPlan: MembershipPlan = {
        id: '1',
        name: 'Basic Plan',
        duration: 1,
        price: 10,
        createdAt: '',
        updatedAt: '',
      };

      mockMembershipPlanRepository.findOne.mockResolvedValue(membershipPlan);

      const result = await service.findOne('1');
      expect(result).toEqual(membershipPlan);
    });
  });

  describe('update', () => {
    it('should update a membership plan and return it', async () => {
      const updateMembershipPlanDto: UpdateMembershipPlanDto = {
        name: 'Premium Plan',
        price: 20,
      };
      const membershipPlan: MembershipPlan = {
        id: '1',
        name: 'Basic Plan',
        duration: 1,
        price: 10,
        createdAt: '',
        updatedAt: '',
      };

      mockMembershipPlanRepository.update.mockResolvedValue(membershipPlan);

      const result = await service.update('1', updateMembershipPlanDto);
      expect(result).toEqual(membershipPlan);
    });
  });

  describe('remove', () => {
    it('should remove a membership plan and return it', async () => {
      const membershipPlan: MembershipPlan = {
        id: '1',
        name: 'Basic Plan',
        duration: 1,
        price: 10,
        createdAt: '',
        updatedAt: '',
      };

      mockMembershipPlanRepository.remove.mockResolvedValue(membershipPlan);

      const result = await service.remove('1');
      expect(result).toEqual(membershipPlan);
    });
  });
});
