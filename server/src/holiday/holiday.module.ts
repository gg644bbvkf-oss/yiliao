import { Module, Global, OnModuleInit } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { HolidayController } from './holiday.controller';

@Global()
@Module({
  controllers: [HolidayController],
  providers: [HolidayService],
  exports: [HolidayService],
})
export class HolidayModule implements OnModuleInit {
  constructor(private readonly holidayService: HolidayService) {}

  async onModuleInit() {
    // 服务启动时自动初始化未来一年的法定节假日（已存在的日期不覆盖管理员手动调整）
    try {
      const { added } = await this.holidayService.ensureHolidays();
      // eslint-disable-next-line no-console
      console.log(`[holiday] 法定节假日初始化完成，新增 ${added} 天`);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('[holiday] 节假日初始化失败:', e?.message);
    }
  }
}
