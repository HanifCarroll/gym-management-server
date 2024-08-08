import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { SupabaseService } from '../supabase/supabase.service';
import { supabaseServiceMock } from '../supabase/supabase.service.mock';
import { transformSupabaseResultToCamelCase } from '../utils';

jest.mock('../utils', () => ({
  transformSupabaseResultToCamelCase: jest.fn(),
}));

describe('CheckInService', () => {
  let service: CheckInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckInService,
        {
          provide: SupabaseService,
          useValue: supabaseServiceMock,
        },
      ],
    }).compile();

    service = module.get<CheckInService>(CheckInService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCheckIn', () => {
    it('should throw NotFoundException if member is not found', async () => {
      supabaseServiceMock.single.mockReturnValueOnce({
        data: null,
        error: { message: 'Not found' },
      });

      await expect(service.createCheckIn('1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if member is not active', async () => {
      supabaseServiceMock.single.mockReturnValueOnce({
        data: { id: '1', status: 'Inactive' },
        error: null,
      });

      await expect(service.createCheckIn('1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException if check-in creation fails', async () => {
      supabaseServiceMock.single
        .mockReturnValueOnce({
          data: { id: '1', status: 'Active' },
          error: null,
        })
        .mockReturnValueOnce({
          data: null,
          error: { message: 'Insert failed' },
        });

      await expect(service.createCheckIn('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should create check-in successfully', async () => {
      const checkInData = { id: '1', member_id: '1' };
      supabaseServiceMock.single
        .mockReturnValueOnce({
          data: { id: '1', status: 'Active' },
          error: null,
        })
        .mockReturnValueOnce({
          data: checkInData,
          error: null,
        });

      (transformSupabaseResultToCamelCase as jest.Mock).mockReturnValueOnce(
        checkInData,
      );

      const result = await service.createCheckIn('1');
      expect(result).toEqual(checkInData);
    });
  });

  describe('getHistoricalCheckIns', () => {
    it('should throw InternalServerErrorException if retrieval fails', async () => {
      supabaseServiceMock.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        data: null,
        error: { message: 'Query failed' },
      });

      await expect(service.getHistoricalCheckIns('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should retrieve historical check-ins successfully for a specific member', async () => {
      const checkInsData = [{ id: '1', member_id: '1' }];
      supabaseServiceMock.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        data: checkInsData,
        error: null,
      });

      (transformSupabaseResultToCamelCase as jest.Mock).mockReturnValueOnce(
        checkInsData,
      );

      const result = await service.getHistoricalCheckIns('1');
      expect(result).toEqual(checkInsData);
    });

    it('should retrieve all historical check-ins successfully', async () => {
      const checkInsData = [{ id: '1', member_id: '1' }];
      supabaseServiceMock.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        data: checkInsData,
        error: null,
      });

      (transformSupabaseResultToCamelCase as jest.Mock).mockReturnValueOnce(
        checkInsData,
      );

      const result = await service.getHistoricalCheckIns();
      expect(result).toEqual(checkInsData);
    });
  });
});
