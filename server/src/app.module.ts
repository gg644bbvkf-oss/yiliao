import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AppointmentModule } from '@/appointment/appointment.module';
import { AdminModule } from '@/admin/admin.module';

@Module({
  imports: [AppointmentModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
