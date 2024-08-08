import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentResponse } from './entities/create-payment-response';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initiate a new payment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment successfully initiated',
    type: CreatePaymentResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member not found',
  })
  async initiatePayment(
    @Body() initiatePaymentDto: InitiatePaymentDto,
  ): Promise<CreatePaymentResponse> {
    if (initiatePaymentDto.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }
    return this.paymentService.createPayment(
      initiatePaymentDto.memberId,
      initiatePaymentDto.amount,
    );
  }

  @Post('confirm/:paymentIntentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm a payment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment successfully confirmed',
    type: Payment,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment not found',
  })
  @ApiParam({ name: 'paymentIntentId', type: 'string' })
  async confirmPayment(
    @Param('paymentIntentId') paymentIntentId: string,
  ): Promise<Payment> {
    return this.paymentService.confirmPayment(paymentIntentId);
  }

  @Get('history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get payment history' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved payment history',
    type: [Payment],
  })
  @ApiQuery({ name: 'memberId', required: false, type: 'string' })
  async getPaymentHistory(
    @Query('memberId') memberId?: string,
  ): Promise<Payment[]> {
    return this.paymentService.getPaymentHistory(memberId);
  }
}
