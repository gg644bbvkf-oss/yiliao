import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { HolidayService } from './holiday.service';

@Controller('admin/holidays')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  /** 管理端：查询日期区间内的节假日记录
   *  dates 支持逗号分隔的日期数组 */
  @Get()
  async list(@Query('dates') dates?: string, @Query('start') start?: string, @Query('end') end?: string) {
    try {
      let dateList: string[] = [];
      if (dates) {
        dateList = dates.split(',').map((d) => d.trim()).filter(Boolean);
      } else if (start && end) {
        const s = new Date(start);
        const e = new Date(end);
        for (let t = new Date(s); t <= e; t = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1)) {
          dateList.push(`${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`);
        }
      }
      const rows = await this.holidayService.listHolidays(dateList);
      return { code: 200, msg: 'success', data: { rows } };
    } catch (e: any) {
      return { code: 500, msg: e.message || '查询节假日失败', data: { rows: [] } };
    }
  }

  /** 管理端：设置某日为节假日 / 改回正常接诊（全院生效） */
  @Post()
  async set(@Body() body: { date: string; isHoliday: boolean; name?: string }) {
    try {
      const data = await this.holidayService.setHoliday(body.date, !!body.isHoliday, body.name);
      return { code: 200, msg: '设置成功', data };
    } catch (e: any) {
      return { code: 400, msg: e.message || '设置失败' };
    }
  }

  /** 管理端：手动触发重新初始化未来一年法定节假日 */
  @Post('init')
  async init() {
    try {
      const data = await this.holidayService.ensureHolidays();
      return { code: 200, msg: 'success', data };
    } catch (e: any) {
      return { code: 500, msg: e.message || '初始化失败' };
    }
  }
}
