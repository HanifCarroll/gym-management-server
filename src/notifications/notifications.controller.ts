import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return await this.notificationsService.create(createNotificationDto);
  }

  @Get()
  async findAll() {
    return await this.notificationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return await this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.notificationsService.remove(+id);
  }

  @Get('recipient/:recipientId')
  async findByRecipient(@Param('recipientId') recipientId: string) {
    return await this.notificationsService.findByRecipient(+recipientId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return await this.notificationsService.markAsRead(+id);
  }
}
