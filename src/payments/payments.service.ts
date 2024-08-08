import { BadRequestException, Injectable } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentResponse } from './entities/create-payment-response';
import { PaymentRepository } from './payments.repository';
import { MemberRepository } from '../members/member.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly stripeService: StripeService,
  ) {}

  async createPayment(
    memberId: string,
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

    const paymentResponse = await this.paymentRepository.createPaymentRecord(
      memberId,
      amount,
      paymentIntent.id,
    );

    return {
      ...paymentResponse,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async confirmPayment(paymentIntentId: string): Promise<Payment> {
    const payment =
      await this.paymentRepository.findPaymentByIntentId(paymentIntentId);

    await this.paymentRepository.updatePaymentStatus(payment.id, 'Successful');
    await this.memberRepository.updateMemberStatus(payment.memberId, 'Active');

    await this.updateMembership(payment.memberId);

    return payment;
  }

  async getPaymentHistory(memberId?: string): Promise<Payment[]> {
    if (memberId) {
      // Check to see if member exists
      await this.memberRepository.findById(memberId);
    }

    return this.paymentRepository.getPaymentHistory(memberId);
  }

  private async updateMembership(memberId: string): Promise<void> {
    const existingMembership =
      await this.paymentRepository.findExistingMembership(memberId);
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (existingMembership) {
      const newEndDate = new Date(existingMembership.end_date);
      newEndDate.setDate(newEndDate.getDate() + 30);
      await this.paymentRepository.extendMembership(
        existingMembership.id,
        newEndDate.toISOString(),
      );
    } else {
      await this.paymentRepository.createNewMembership(
        memberId,
        now.toISOString(),
        thirtyDaysLater.toISOString(),
      );
    }
  }
}
