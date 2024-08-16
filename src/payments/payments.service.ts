import { BadRequestException, Injectable } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentResponse } from './entities/create-payment-response';
import { PaymentRepository } from './payments.repository';
import { MemberRepository } from '../members/member.repository';
import { MembershipPlanRepository } from '../membership-plans/membership-plans.repository';
import { addMonths, isAfter } from 'date-fns';

@Injectable()
export class PaymentService {
  private readonly memberRepository: MemberRepository;
  private readonly paymentRepository: PaymentRepository;
  private readonly membershipPlanRepository: MembershipPlanRepository;
  private readonly stripeService: StripeService;

  constructor(
    memberRepository: MemberRepository,
    paymentRepository: PaymentRepository,
    membershipPlanRepository: MembershipPlanRepository,
    stripeService: StripeService,
  ) {
    this.memberRepository = memberRepository;
    this.paymentRepository = paymentRepository;
    this.membershipPlanRepository = membershipPlanRepository;
    this.stripeService = stripeService;
  }

  async createPayment(
    memberId: string,
    planId: string,
    amount: number,
  ): Promise<CreatePaymentResponse> {
    // Check to see if member exists
    await this.memberRepository.findById(memberId);

    if (amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }

    const paymentIntent = await this.stripeService.createPaymentIntent(
      amount,
      'usd',
    );

    const paymentResponse = await this.paymentRepository.createPaymentRecord({
      memberId,
      planId,
      amount,
      stripePaymentIntentId: paymentIntent.id,
    });

    return {
      ...paymentResponse,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async confirmPayment(paymentIntentId: string): Promise<Payment> {
    const payment =
      await this.paymentRepository.findPaymentByIntentId(paymentIntentId);
    console.log('payment', payment);
    await this.paymentRepository.updatePaymentStatus(payment.id, 'Successful');
    await this.updateMembership(payment.memberId, payment.planId);

    return payment;
  }

  async getPaymentHistory(memberId?: string): Promise<Payment[]> {
    if (memberId) {
      // Check to see if member exists
      await this.memberRepository.findById(memberId);
    }

    return this.paymentRepository.getPaymentHistory(memberId);
  }

  private async updateMembership(
    memberId: string,
    membershipPlanId: string,
  ): Promise<void> {
    console.log('vars', memberId, membershipPlanId);
    const membershipPlan =
      await this.membershipPlanRepository.findOne(membershipPlanId);
    const existingMembership =
      await this.paymentRepository.findExistingMembership(memberId);
    const now = new Date();
    const membershipPlanDuration = membershipPlan.duration; // In months

    if (existingMembership) {
      const membershipEndDate = new Date(existingMembership.end_date);
      // If membership has already expired, extend from now
      const extensionStartDate = isAfter(membershipEndDate, now)
        ? membershipEndDate
        : now;
      const newEndDate = addMonths(extensionStartDate, membershipPlanDuration);
      await this.paymentRepository.extendMembership(
        existingMembership.id,
        newEndDate.toISOString(),
      );
    } else {
      const member = await this.memberRepository.findById(memberId);
      if (member.status === 'Inactive') {
        await this.memberRepository.updateMemberStatus(memberId, 'Active');
      }
      const endDate = addMonths(now, membershipPlanDuration);
      await this.paymentRepository.createNewMembership({
        memberId,
        planId: membershipPlanId,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
      });
    }
  }
}
