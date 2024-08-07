import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from './payments.service';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('initiate')
  async initiatePayment(@Body() body: { memberId: string; amount: number }) {
    const paymentData = await this.paymentService.createPayment(
      body.memberId,
      body.amount,
    );

    return {
      paymentId: paymentData.paymentId,
      clientSecret: paymentData.clientSecret,
      paymentIntentId: paymentData.paymentIntentId,
    };
  }

  @Post('confirm/:paymentIntentId')
  async confirmPayment(@Param('paymentIntentId') paymentIntentId: string) {
    const payment = await this.paymentService.confirmPayment(paymentIntentId);
    return { success: true, payment };
  }

  @Get('history/:memberId')
  async getPaymentHistory(@Param('memberId') memberId: string) {
    return this.paymentService.getPaymentHistory(memberId);
  }
}
