import { Controller, Get, Post, Delete, Body, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /** 管理员识别 */
  @Get('check')
  async check(@Query('phone') phone: string) {
    try {
      const isAdmin = await this.adminService.isAdmin(phone || '');
      return { code: 200, msg: 'success', data: { isAdmin } };
    } catch (e: any) {
      return { code: 500, msg: e.message || '识别管理员失败', data: { isAdmin: false } };
    }
  }

  /** 号源查询 */
  @Get('quota')
  async listQuota(
    @Query('departmentId') departmentId: string,
    @Query('departmentName') departmentName: string,
    @Query('dates') dates: string,
  ) {
    try {
      const dateList = dates ? dates.split(',') : [];
      // 确保号源初始化
      await this.adminService.ensureQuotaForRange(departmentId, departmentName, dateList);
      // 统计已预约数，计算剩余号源
      const booked = await this.adminService.getBookedStats(departmentId, dateList);
      const data = await this.adminService.listQuota(departmentId, departmentName, dateList, booked);
      return { code: 200, msg: 'success', data };
    } catch (e: any) {
      return { code: 500, msg: e.message || '查询号源失败', data: [] };
    }
  }

  /** 设置号源 */
  @Post('quota')
  async setQuota(
    @Body()
    body: {
      departmentId: string;
      departmentName: string;
      date: string;
      morningQuota: number;
      afternoonQuota: number;
      isHoliday?: boolean;
    },
  ) {
    try {
      const data = await this.adminService.setQuota({
        departmentId: body.departmentId,
        departmentName: body.departmentName,
        date: body.date,
        morningQuota: body.morningQuota,
        afternoonQuota: body.afternoonQuota,
        isHoliday: !!body.isHoliday,
      });
      return { code: 200, msg: '保存成功', data };
    } catch (e: any) {
      return { code: 500, msg: e.message || '保存失败' };
    }
  }

  /** 黑名单列表 */
  @Get('blacklist')
  async listBlacklist() {
    try {
      const data = await this.adminService.listBlacklist();
      return { code: 200, msg: 'success', data };
    } catch (e: any) {
      return { code: 500, msg: e.message || '查询黑名单失败', data: [] };
    }
  }

  /** 添加黑名单 */
  @Post('blacklist')
  async addBlacklist(@Body() body: { name: string; idCard: string; reason?: string }) {
    try {
      const data = await this.adminService.addBlacklist(body);
      return { code: 200, msg: '添加成功', data };
    } catch (e: any) {
      return { code: 500, msg: e.message || '添加失败' };
    }
  }

  /** 移除黑名单 */
  @Delete('blacklist')
  async removeBlacklist(@Query('id') id: string) {
    try {
      await this.adminService.removeBlacklist(id);
      return { code: 200, msg: '移除成功' };
    } catch (e: any) {
      return { code: 500, msg: e.message || '移除失败' };
    }
  }
}