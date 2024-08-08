import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { NotFoundException } from '@nestjs/common';
import { MemberStatus } from './entities/member.entity';
import { supabaseServiceMock } from '../supabase/supabase.service.mock';

describe('MembersService', () => {
  let service: MembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        { provide: SupabaseService, useValue: supabaseServiceMock },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new member', async () => {
      const createMemberDto: CreateMemberDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        status: MemberStatus.Active,
      };

      const mockResponse = {
        data: {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          status: 'active',
        },
        error: null,
      };

      supabaseServiceMock.single.mockResolvedValue(mockResponse);

      const result = await service.create(createMemberDto);

      expect(result).toEqual({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        status: 'active',
      });
      expect(supabaseServiceMock.from).toHaveBeenCalledWith('member');
      expect(supabaseServiceMock.insert).toHaveBeenCalledWith([
        expect.any(Object),
      ]);
      expect(supabaseServiceMock.select).toHaveBeenCalled();
      expect(supabaseServiceMock.single).toHaveBeenCalled();
    });

    it('should throw an error if Supabase insert fails', async () => {
      const createMemberDto: CreateMemberDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        status: MemberStatus.Active,
      };

      const mockResponse = {
        data: null,
        error: new Error('Supabase error'),
      };

      supabaseServiceMock.single.mockResolvedValue(mockResponse);

      await expect(service.create(createMemberDto)).rejects.toThrow(
        'Supabase error',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            phone: '1234567890',
            status: 'active',
          },
          {
            id: '2',
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'jane@example.com',
            phone: '0987654321',
            status: 'inactive',
          },
        ],
        error: null,
      };

      supabaseServiceMock.select.mockResolvedValue(mockResponse);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          status: 'active',
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          phone: '0987654321',
          status: 'inactive',
        },
      ]);
      expect(supabaseServiceMock.from).toHaveBeenCalledWith('member');
      expect(supabaseServiceMock.select).toHaveBeenCalledWith(
        'id, first_name, last_name, email, phone, status',
      );
    });

    it('should throw an error if Supabase select fails', async () => {
      const mockResponse = {
        data: null,
        error: new Error('Supabase error'),
      };

      supabaseServiceMock.select.mockResolvedValue(mockResponse);

      await expect(service.findAll()).rejects.toThrow('Supabase error');
    });
  });

  describe('update', () => {
    it('should update a member', async () => {
      const updateMemberDto: UpdateMemberDto = {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        phone: '1234567890',
        status: MemberStatus.Active,
      };

      const mockResponse = {
        data: {
          id: '1',
          first_name: 'John',
          last_name: 'Smith',
          email: 'john@example.com',
          phone: '1234567890',
          status: 'active',
        },
        error: null,
      };

      supabaseServiceMock.select.mockResolvedValue(mockResponse);

      const result = await service.update(updateMemberDto);

      expect(result).toEqual({
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        phone: '1234567890',
        status: 'active',
      });
      expect(supabaseServiceMock.from).toHaveBeenCalledWith('member');
      expect(supabaseServiceMock.update).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(supabaseServiceMock.eq).toHaveBeenCalledWith('id', '1');
      expect(supabaseServiceMock.select).toHaveBeenCalledWith(
        'id, first_name, last_name, email, phone, status',
      );
    });

    it('should throw an error if Supabase update fails', async () => {
      const updateMemberDto: UpdateMemberDto = {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
      };

      const mockResponse = {
        data: null,
        error: new Error('Supabase error'),
      };

      supabaseServiceMock.select.mockResolvedValue(mockResponse);

      await expect(service.update(updateMemberDto)).rejects.toThrow(
        'Supabase error',
      );
    });
  });

  describe('remove', () => {
    it('should remove a member', async () => {
      const mockResponse = {
        data: {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          status: 'active',
        },
        error: null,
      };

      supabaseServiceMock.select.mockResolvedValue(mockResponse);

      const result = await service.remove('1');

      expect(result).toEqual({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        status: 'active',
      });
      expect(supabaseServiceMock.from).toHaveBeenCalledWith('member');
      expect(supabaseServiceMock.delete).toHaveBeenCalled();
      expect(supabaseServiceMock.eq).toHaveBeenCalledWith('id', '1');
      expect(supabaseServiceMock.select).toHaveBeenCalled();
    });

    it('should throw NotFoundException if member is not found', async () => {
      const mockResponse = {
        data: null,
        error: { code: 'PGRST116' },
      };

      supabaseServiceMock.select.mockResolvedValue(mockResponse);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if Supabase delete fails', async () => {
      const mockResponse = {
        data: null,
        error: new Error('Supabase error'),
      };

      supabaseServiceMock.select.mockResolvedValue(mockResponse);

      await expect(service.remove('1')).rejects.toThrow('Supabase error');
    });
  });
});
