import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { PaymentService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentResponse } from './entities/create-payment-response';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('initiate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate a new payment' })
  @ApiResponse({
    status: 200,
    description: 'Payment successfully initiated',
    type: CreatePaymentResponse,
  })
  async initiatePayment(
    @Body() body: { memberId: string; amount: number },
  ): Promise<CreatePaymentResponse> {
    return this.paymentService.createPayment(body.memberId, body.amount);
  }

  @Post('confirm/:paymentIntentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm a payment' })
  @ApiResponse({
    status: 200,
    description: 'Payment successfully confirmed',
    type: Payment,
  })
  async confirmPayment(
    @Param('paymentIntentId') paymentIntentId: string,
  ): Promise<{
    success: boolean;
    payment: Payment;
  }> {
    const payment = await this.paymentService.confirmPayment(paymentIntentId);
    return { success: true, payment };
  }

  @Get('history/:memberId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get payment history for a specific member' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved payment history',
    type: [Payment],
  })
  async getPaymentHistory(
    @Param('memberId') memberId: string,
  ): Promise<Payment[]> {
    return this.paymentService.getPaymentHistory(memberId);
  }

  @Get('history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all payment histories' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all payment histories',
    type: [Payment],
  })
  async getAllPayments(): Promise<Payment[]> {
    return this.paymentService.getPaymentHistory();
  }
}
