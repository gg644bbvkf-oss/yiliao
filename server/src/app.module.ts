import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AppointmentModule } from '@/appointment/appointment.module';
import { AdminModule } from '@/admin/admin.module';
import { ContentModule } from '@/content/content.module';

@Module({
  imports: [AppointmentModule, AdminModule, ContentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
