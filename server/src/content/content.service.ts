import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';
import { S3Storage } from 'coze-coding-dev-sdk';
import { createHash } from 'crypto';

interface DbRow {
  id: string;
  [key: string]: any;
}

@Injectable()
export class ContentService {
  private readonly client = getSupabaseClient();

  /** 管理员校验：校验手机号+密码，返回管理员信息 */
  async verifyAdmin(phone: string, password: string) {
    if (!phone || !password) {
      throw new HttpException('请输入手机号和密码', HttpStatus.UNAUTHORIZED);
    }
    if (!phone) throw new HttpException('请输入管理员手机号', HttpStatus.UNAUTHORIZED);
    const { data, error } = await this.client
      .from('admins')
      .select('id, phone, name, role')
      .eq('phone', phone)
      .limit(1);
    if (error || !data || data.length === 0) {
      throw new HttpException('管理员不存在', HttpStatus.UNAUTHORIZED);
    }
    const { data: full } = await this.client.from('admins').select('password').eq('id', data[0].id).single();
    const stored = full?.password ?? '';
    const pwdHash = createHash('sha256').update(password).digest('hex');
    if (stored && stored.length === 64) {
      if (stored !== pwdHash) throw new HttpException('密码错误', HttpStatus.UNAUTHORIZED);
    } else if (stored !== password) {
      throw new HttpException('密码错误', HttpStatus.UNAUTHORIZED);
    }
    return data[0];
  }

  /** 修改管理员登录密码（旧密码由调用方先经 verifyAdmin 校验） */
  async changePassword(phone: string, newPassword: string) {
    const pwdHash = createHash('sha256').update(newPassword).digest('hex');
    const { error } = await this.client.from('admins').update({ password: pwdHash }).eq('phone', phone);
    if (error) throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    return { updated: true };
  }

  /* ---------- 公开读取 ---------- */
  async getHospitalContent(): Promise<Record<string, string>> {
    const { data, error } = await this.client.from('hospital_content').select('key, value');
    if (error) throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    const map: Record<string, string> = {};
    const list = (data || []) as Array<{ key: string; value?: string | null }>;
    list.forEach((r) => {
      map[r.key] = r.value ?? '';
    });
    return map;
  }

  async getDepartments() {
    const { data, error } = await this.client
      .from('departments')
      .select('id, name, description, icon, location, sort_order')
      .order('sort_order', { ascending: true });
    if (error) throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    return data || [];
  }

  async getDoctors() {
    const { data, error } = await this.client
      .from('doctors')
      .select('id, name, department_id, department_name, title, specialty, introduction, avatar, sort_order')
      .order('sort_order', { ascending: true });
    if (error) throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    return (data || []).map((d: DbRow) => ({
      id: d.id,
      name: d.name,
      departmentId: d.department_id,
      departmentName: d.department_name,
      title: d.title,
      specialty: d.specialty,
      introduction: d.introduction,
      avatar: d.avatar,
    }));
  }

  /* ---------- 医院内容编辑 ---------- */
  async saveHospitalContent(body: Record<string, string>) {
    const entries = Object.entries(body).filter(([k, v]) => k && v !== undefined);
    for (const [key, value] of entries) {
      const { data } = await this.client.from('hospital_content').select('key').eq('key', key).limit(1);
      if (data && data.length > 0) {
        await this.client.from('hospital_content').update({ value: String(value) }).eq('key', key);
      } else {
        await this.client.from('hospital_content').insert({ key, value: String(value) });
      }
    }
    return this.getHospitalContent();
  }

  /* ---------- 科室增删改 ---------- */
  async createDepartment(body: any): Promise<any> {
    if (!body?.name) throw new HttpException('科室名称不能为空', HttpStatus.BAD_REQUEST);
    const { data, error } = await this.client
      .from('departments')
      .insert({ name: body.name, description: body.description || '', icon: body.icon || 'Stethoscope', location: body.location || '', sort_order: Number(body.sortOrder) || 99 })
      .select()
      .single();
    if (error) throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    return data;
  }

  async updateDepartment(id: string, body: any): Promise<any> {
    const patch: any = {};
    if (body.name !== undefined) patch.name = body.name;
    if (body.description !== undefined) patch.description = body.description;
    if (body.location !== undefined) patch.location = body.location;
    if (body.icon !== undefined) patch.icon = body.icon;
    if (body.sortOrder !== undefined) patch.sort_order = Number(body.sortOrder);
    const { data, error } = await this.client.from('departments').update(patch).eq('id', id).select().single();
    if (error) throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    return data;
  }

  async deleteDepartment(id: string) {
    // 级联删除该科室下的医生与号源设置（保留历史预约记录）
    const { data: docs } = await this.client.from('doctors').select('id').eq('department_id', id);
    if (docs && docs.length > 0) {
      const { error: docErr } = await this.client
        .from('doctors')
        .delete()
        .eq('department_id', id);
      if (docErr) throw new HttpException(docErr.message, HttpStatus.BAD_GATEWAY);
    }
    await this.client.from('quota_settings').delete().eq('department_id', id);
    const { error } = await this.client.from('departments').delete().eq('id', id);
    if (error) throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    return { deleted: true, doctorCount: docs?.length ?? 0 };
  }

  /* ---------- 医生增删改 ---------- */
  async createDoctor(body: any): Promise<any> {
    if (!body?.name) throw new HttpException('医生姓名不能为空', HttpStatus.BAD_REQUEST);
    let departmentName = body.departmentName || '';
    if (body.departmentId && !departmentName) {
      const { data } = await this.client.from('departments').select('name').eq('id', body.departmentId).single();
      departmentName = data?.name || '';
    }
    const { data, error } = await this.client
      .from('doctors')
      .insert({
        name: body.name,
        department_id: body.departmentId || null,
        department_name: departmentName,
        title: body.title || '',
        specialty: body.specialty || '',
        introduction: body.introduction || '',
        avatar: body.avatar || '',
        sort_order: Number(body.sortOrder) || 99,
      })
      .select()
      .single();
    if (error) throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    return data;
  }

  async updateDoctor(id: string, body: any): Promise<any> {
    const patch: any = {};
    if (body.name !== undefined) patch.name = body.name;
    if (body.departmentId !== undefined) patch.department_id = body.departmentId;
    if (body.departmentName !== undefined) patch.department_name = body.departmentName;
    if (body.title !== undefined) patch.title = body.title;
    if (body.specialty !== undefined) patch.specialty = body.specialty;
    if (body.introduction !== undefined) patch.introduction = body.introduction;
    if (body.avatar !== undefined) patch.avatar = body.avatar;
    if (body.sortOrder !== undefined) patch.sort_order = Number(body.sortOrder);
    const { data, error } = await this.client.from('doctors').update(patch).eq('id', id).select().single();
    if (error) throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    return data;
  }

  async deleteDoctor(id: string) {
    const { error } = await this.client.from('doctors').delete().eq('id', id);
    if (error) throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    return { deleted: true };
  }

  /* ---------- 图片上传（存对象存储，返回 URL） ---------- */
  async uploadImage(file: any): Promise<string> {
    const buffer = file.buffer || file.path;
    if (!buffer) throw new HttpException('文件内容为空', HttpStatus.BAD_REQUEST);
    const buf = Buffer.isBuffer(buffer) ? buffer : require('fs').readFileSync(buffer);
    const extMatch = (file.originalname || 'x.png').match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'png';
    const filename = `doctor-${Date.now()}.${ext}`;
    try {
      const storage = new S3Storage({
        endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
        accessKey: process.env.COZE_BUCKET_ACCESS_KEY ?? '',
        secretKey: process.env.COZE_BUCKET_SECRET_KEY ?? '',
        bucketName: process.env.COZE_BUCKET_NAME ?? '',
        region: 'cn-beijing',
      });
      const key = await storage.uploadFile({
        fileContent: buf,
        fileName: filename,
        contentType: file.mimetype || 'image/png',
      });
      const url = await storage.generatePresignedUrl({ key, expireTime: 2592000 });
      return url;
    } catch (e: any) {
      throw new HttpException('图片上传失败：' + (e?.message || ''), HttpStatus.BAD_GATEWAY);
    }
  }
}