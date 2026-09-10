import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async create(
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
    try {
      const appointment = await this.appointmentService.create(body);
      return { code: 200, msg: '预约成功', data: appointment };
    } catch (e: any) {
      return { code: 400, msg: e.message || '预约失败' };
    }
  }

  @Get()
  async findAll(@Query('phone') phone?: string) {
    try {
      if (phone) {
        const list = await this.appointmentService.findByPhone(phone);
        return { code: 200, msg: 'success', data: { list } };
      }
      const list = await this.appointmentService.findAll();
      const stats = await this.appointmentService.getStats();
      return { code: 200, msg: 'success', data: { list, stats } };
    } catch (e: any) {
      return { code: 500, msg: e.message || '查询失败', data: { list: [], stats: { total: 0, confirmed: 0, cancelled: 0 } } };
    }
  }

  /** 患者端：查询某科室某日各时段剩余号源 */
  @Get('quota')
  async quota(
    @Query('departmentId') departmentId: string,
    @Query('departmentName') departmentName: string,
    @Query('date') date: string,
  ) {
    try {
      const morning = await this.appointmentService.checkQuota(departmentId, departmentName, date, '上午');
      const afternoon = await this.appointmentService.checkQuota(departmentId, departmentName, date, '下午');
      // 返回扁平字段，与前端 booking-form 期望一致
      const morningQuota = await this.appointmentService.getQuotaPublic(departmentId, departmentName, date);
      return {
        code: 200,
        msg: 'success',
        data: {
          date,
          morningQuota: morning.total,
          afternoonQuota: afternoon.total,
          morningLeft: morning.remaining,
          afternoonLeft: afternoon.remaining,
          isHoliday: morningQuota?.isHoliday ?? false,
          holidayName: (morningQuota as any)?.holidayName || '',
        },
      };
    } catch (e: any) {
      return { code: 200, msg: e.message || '查询号源失败', data: null };
    }
  }

  @Get('daily-stats')
  async dailyStats() {
    try {
      const data = await this.appointmentService.getDailyStats();
      return { code: 200, msg: 'success', data };
    } catch (e: any) {
      return { code: 500, msg: e.message || '统计失败', data: [] };
    }
  }

  @Get('admin/list')
  async adminList(
    @Query('date') date?: string,
    @Query('departmentId') departmentId?: string,
    @Query('status') status?: string,
  ) {
    try {
      const data = await this.appointmentService.findAllByFilter({ date, departmentId, status });
      return { code: 200, msg: 'success', data };
    } catch (e: any) {
      return { code: 500, msg: e.message || '查询失败', data: [] };
    }
  }

  @Post('cancel')
  async cancel(@Body() body: { id: string }) {
    try {
      const appointment = await this.appointmentService.cancel(body.id);
      if (!appointment) {
        return { code: 404, msg: '预约记录不存在' };
      }
      return { code: 200, msg: '取消成功', data: appointment };
    } catch (e: any) {
      return { code: 400, msg: e.message || '取消失败' };
    }
  }
}