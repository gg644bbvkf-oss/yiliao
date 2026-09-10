import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { HolidayModule } from '@/holiday/holiday.module';
import { AppointmentModule } from '@/appointment/appointment.module';
import { AdminModule } from '@/admin/admin.module';
import { ContentModule } from '@/content/content.module';

@Module({
  imports: [HolidayModule, AppointmentModule, AdminModule, ContentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
