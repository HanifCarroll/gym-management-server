import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payments.service';
import { MemberRepository } from '../members/member.repository';
import { PaymentRepository } from './payments.repository';
import { StripeService } from '../stripe/stripe.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePaymentResponse } from './entities/create-payment-response';
import { Payment, PaymentStatus } from './entities/payment.entity';

describe('PaymentService', () => {
  let service: PaymentService;

  const mockMemberRepository = {
    findById: jest.fn(),
    updateMemberStatus: jest.fn(),
  };

  const mockPaymentRepository = {
    createPaymentRecord: jest.fn(),
    findPaymentByIntentId: jest.fn(),
    updatePaymentStatus: jest.fn(),
    findExistingMembership: jest.fn(),
    extendMembership: jest.fn(),
    createNewMembership: jest.fn(),
    getPaymentHistory: jest.fn(),
  };

  const mockStripeService = {
    createPaymentIntent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: MemberRepository,
          useValue: mockMemberRepository,
        },
        {
          provide: PaymentRepository,
          useValue: mockPaymentRepository,
        },
        {
          provide: StripeService,
          useValue: mockStripeService,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayment', () => {
    it('should throw NotFoundException if member is not found', async () => {
      mockMemberRepository.findById.mockResolvedValue(null);
      await expect(service.createPayment('1', 100)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create a payment and return CreatePaymentResponse', async () => {
      const member = { id: '1', name: 'John Doe' };
      const paymentIntent = { id: 'pi_1', client_secret: 'secret_123' };
      const paymentResponse: CreatePaymentResponse = {
        paymentId: '1',
        clientSecret: 'secret_123',
        paymentIntentId: 'pi_1',
      };

      mockMemberRepository.findById.mockResolvedValue(member);
      mockStripeService.createPaymentIntent.mockResolvedValue(paymentIntent);
      mockPaymentRepository.createPaymentRecord.mockResolvedValue(
        paymentResponse,
      );

      const result = await service.createPayment('1', 100);
      expect(result).toEqual(paymentResponse);
    });
  });

  describe('confirmPayment', () => {
    it('should confirm payment and return the Payment entity', async () => {
      const payment: Payment = {
        id: '1',
        memberId: '1',
        amount: 100,
        date: '2023-01-01',
        status: PaymentStatus.PENDING,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };
      const existingMembership = {
        id: '1',
        memberId: '1',
        start_date: '2023-01-01',
        end_date: '2023-01-31',
      };

      mockPaymentRepository.findPaymentByIntentId.mockResolvedValue(payment);
      mockPaymentRepository.findExistingMembership.mockResolvedValue(
        existingMembership,
      );
      mockPaymentRepository.updatePaymentStatus.mockResolvedValue(payment);
      mockMemberRepository.updateMemberStatus.mockResolvedValue(true);
      mockPaymentRepository.extendMembership.mockResolvedValue(true);

      const result = await service.confirmPayment('pi_1');
      expect(result).toEqual(payment);
    });
  });

  describe('getPaymentHistory', () => {
    it('should return payment history for a member', async () => {
      const payments: Payment[] = [
        {
          id: '1',
          memberId: '1',
          amount: 100,
          date: '2023-01-01',
          status: PaymentStatus.SUCCESSFUL,
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
        {
          id: '2',
          memberId: '2',
          amount: 100,
          date: '2023-01-01',
          status: PaymentStatus.SUCCESSFUL,
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
      ];

      mockPaymentRepository.getPaymentHistory.mockResolvedValue(payments);

      const result = await service.getPaymentHistory('1');
      expect(result).toEqual(payments);
    });

    it('should return payment history for all members if no memberId is provided', async () => {
      const payments: Payment[] = [
        {
          id: '1',
          memberId: '1',
          amount: 100,
          date: '2023-01-01',
          status: PaymentStatus.SUCCESSFUL,
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
        {
          id: '2',
          memberId: '2',
          amount: 100,
          date: '2023-01-01',
          status: PaymentStatus.SUCCESSFUL,
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
      ];

      mockPaymentRepository.getPaymentHistory.mockResolvedValue(payments);

      const result = await service.getPaymentHistory();
      expect(result).toEqual(payments);
    });
  });
});
