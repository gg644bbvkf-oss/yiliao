import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Headers,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly service: ContentService) {}

  /** 管理员身份校验（各写操作都需携带 x-admin-phone / x-admin-password） */
  private async checkAdmin(@Headers() headers: Record<string, string>) {
    return this.service.verifyAdmin(headers['x-admin-phone'] || '', headers['x-admin-password'] || '');
  }

  /* ---------- 公开只读 ---------- */
  @Get('hospital')
  async hospital() {
    return { code: 200, data: await this.service.getHospitalContent() };
  }

  @Get('departments')
  async listDepartments() {
    return { code: 200, data: await this.service.getDepartments() };
  }

  @Get('doctors')
  async listDoctors() {
    return { code: 200, data: await this.service.getDoctors() };
  }

  /* ---------- 管理员验证 ---------- */
  @Get('admin/verify')
  async verify(@Headers() headers: Record<string, string>) {
    const admin = await this.service.verifyAdmin(headers['x-admin-phone'] || '', headers['x-admin-password'] || '');
    return { code: 200, data: { ...admin, isAdmin: true } };
  }

  /* ---------- 修改管理员密码 ---------- */
  @Post('admin/change-password')
  async changePassword(@Headers() h: Record<string, string>, @Body() body: any) {
    await this.checkAdmin(h); // 校验旧密码（header）
    const newPassword = body?.newPassword;
    if (!newPassword) throw new HttpException('新密码不能为空', HttpStatus.BAD_REQUEST);
    if (String(newPassword).length < 6) throw new HttpException('新密码至少 6 位', HttpStatus.BAD_REQUEST);
    return {
      code: 200,
      data: await this.service.changePassword((h['x-admin-phone'] as string) || '', String(newPassword)),
    };
  }

  /* ---------- 医院内容编辑 ---------- */
  @Put('admin/hospital')
  async updateHospital(@Headers() h: Record<string, string>, @Body() body: Record<string, string>) {
    await this.checkAdmin(h);
    return { code: 200, data: await this.service.saveHospitalContent(body) };
  }

  /* ---------- 科室增删改 ---------- */
  @Post('admin/department')
  async createDepartment(@Headers() h: Record<string, string>, @Body() body: any) {
    await this.checkAdmin(h);
    return { code: 200, data: await this.service.createDepartment(body) };
  }

  @Put('admin/department/:id')
  async updateDepartment(@Headers() h: Record<string, string>, @Param('id') id: string, @Body() body: any) {
    await this.checkAdmin(h);
    return { code: 200, data: await this.service.updateDepartment(id, body) };
  }

  @Delete('admin/department/:id')
  async deleteDepartment(@Headers() h: Record<string, string>, @Param('id') id: string) {
    await this.checkAdmin(h);
    return { code: 200, data: await this.service.deleteDepartment(id) };
  }

  /* ---------- 医生增删改 ---------- */
  @Post('admin/doctor')
  async createDoctor(@Headers() h: Record<string, string>, @Body() body: any) {
    await this.checkAdmin(h);
    return { code: 200, data: await this.service.createDoctor(body) };
  }

  @Put('admin/doctor/:id')
  async updateDoctor(@Headers() h: Record<string, string>, @Param('id') id: string, @Body() body: any) {
    await this.checkAdmin(h);
    return { code: 200, data: await this.service.updateDoctor(id, body) };
  }

  @Delete('admin/doctor/:id')
  async deleteDoctor(@Headers() h: Record<string, string>, @Param('id') id: string) {
    await this.checkAdmin(h);
    return { code: 200, data: await this.service.deleteDoctor(id) };
  }

  /* ---------- 医生照片上传 ---------- */
  @Post('admin/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Headers() h: Record<string, string>, @UploadedFile() file: any) {
    await this.checkAdmin(h);
    if (!file) throw new HttpException('未收到文件', HttpStatus.BAD_REQUEST);
    const url = await this.service.uploadImage(file);
    return { code: 200, data: { url } };
  }
}