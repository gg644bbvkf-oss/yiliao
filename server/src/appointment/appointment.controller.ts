import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(
    @Body()
    body: {
      patientName: string;
      patientPhone: string;
      patientIdCard: string;
      departmentId: string;
      departmentName: string;
      doctorId: string;
      doctorName: string;
      doctorTitle: string;
      date: string;
      timeSlot: string;
    },
  ) {
    const appointment = this.appointmentService.create(body);
    return { code: 200, msg: '预约成功', data: appointment };
  }

  @Get()
  findAll(@Query('phone') phone?: string) {
    if (phone) {
      const list = this.appointmentService.findByPhone(phone);
      return { code: 200, msg: 'success', data: list };
    }
    const list = this.appointmentService.findAll();
    const stats = this.appointmentService.getStats();
    return { code: 200, msg: 'success', data: { list, stats } };
  }

  @Post('cancel')
  cancel(@Body() body: { id: string }) {
    const appointment = this.appointmentService.cancel(body.id);
    if (!appointment) {
      return { code: 404, msg: '预约记录不存在' };
    }
    return { code: 200, msg: '取消成功', data: appointment };
  }
}
