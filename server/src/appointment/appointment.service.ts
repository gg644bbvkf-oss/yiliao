import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { HolidayService } from '@/holiday/holiday.service';

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientIdCard: string;
  departmentId?: string;
  departmentName?: string;
  doctorId?: string;
  doctorName?: string;
  doctorTitle?: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

const DEFAULT_MORNING_QUOTA = 20;
const DEFAULT_AFTERNOON_QUOTA = 15;
/** 全院统一号源标识：不区分科室，所有科室共用一份全院号源 */
const GLOBAL_DEPT_ID = 'GLOBAL';

@Injectable()
export class AppointmentService {
  private table = 'appointments';

  constructor(private readonly holidayService: HolidayService) {}

  /** 查询某日期某时段全院已预约数（不区分科室） */
  private async countBooked(_departmentId: string, date: string, timeSlot: string): Promise<number> {
    const client = getSupabaseClient();
    const { count, error } = await client
      .from(this.table)
      .select('*', { count: 'exact', head: true })
      .eq('date', date)
      .eq('time_slot', timeSlot)
      .neq('status', 'cancelled');
    if (error) throw new Error(`查询预约数失败: ${error.message}`);
    return count ?? 0;
  }

  /** 获取全院统一号源设置（不区分科室） */
  private async getQuota(_departmentId: string, departmentName: string, date: string) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('quota_settings')
      .select('*')
      .eq('department_id', GLOBAL_DEPT_ID)
      .eq('date', date)
      .maybeSingle();
    if (error) throw new Error(`查询号源失败: ${error.message}`);
    if (data) {
      const row = data as any;
      // 防御：非节假日但号源为 0（节假日停诊时写 0、恢复接诊后未改回号源的历史脏数据），回落默认号源
      const morning = Number(row.morning_quota) > 0 ? Number(row.morning_quota) : DEFAULT_MORNING_QUOTA;
      const afternoon = Number(row.afternoon_quota) > 0 ? Number(row.afternoon_quota) : DEFAULT_AFTERNOON_QUOTA;
      return {
        departmentId: GLOBAL_DEPT_ID,
        departmentName,
        date,
        morningQuota: morning,
        afternoonQuota: afternoon,
        isHoliday: row.is_holiday,
      };
    }
    return {
      departmentId: GLOBAL_DEPT_ID,
      departmentName,
      date,
      morningQuota: DEFAULT_MORNING_QUOTA,
      afternoonQuota: DEFAULT_AFTERNOON_QUOTA,
      isHoliday: false,
    };
  }

  /** 校验身份证号是否在黑名单 */
  async checkBlacklist(idCard: string): Promise<boolean> {
    const client = getSupabaseClient();
    const { count, error } = await client
      .from('blacklist')
      .select('*', { count: 'exact', head: true })
      .eq('id_card', idCard);
    if (error) throw new Error(`查询黑名单失败: ${error.message}`);
    return (count ?? 0) > 0;
  }

  /** 获取某科室某日号源设置（含 isHoliday），供控制器取节假日标识。
   *  全院节假日（holidays 表）优先级最高：节假日当天号源统一视为 0、停诊。 */
  async getQuotaPublic(departmentId: string, departmentName: string, date: string) {
    const holiday = await this.holidayService.getHolidayDate(date);
    if (holiday && holiday.isHoliday) {
      return { departmentId, departmentName, date, morningQuota: 0, afternoonQuota: 0, isHoliday: true, holidayName: holiday.name };
    }
    const quota = await this.getQuota(departmentId, departmentName, date);
    return { ...quota, isHoliday: false };
  }

  /**
   * 检查号源是否充足（返回剩余号源）
   * 返回 { ok, remaining, total }
   * 全院节假日当天：所有科室号源均为 0 且不可约。
   */
  async checkQuota(departmentId: string, departmentName: string, date: string, timeSlot: string) {
    const holiday = await this.holidayService.getHolidayDate(date);
    if (holiday && holiday.isHoliday) {
      return { ok: false, reason: '该日期为节假日，暂停接诊', remaining: 0, total: 0 };
    }
    const quota = await this.getQuota(departmentId, departmentName, date);
    if (quota.isHoliday) {
      return { ok: false, reason: '该日期为节假日，暂停接诊', remaining: 0 };
    }
    const booked = await this.countBooked(departmentId, date, timeSlot);
    const total = timeSlot === '上午' ? quota.morningQuota : quota.afternoonQuota;
    const remaining = Math.max(0, total - booked);
    return { ok: remaining > 0, remaining, total };
  }

  async create(data: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Promise<Appointment> {
    // 1. 黑名单校验
    if (data.patientIdCard) {
      const blocked = await this.checkBlacklist(data.patientIdCard);
      if (blocked) {
        throw new Error('抱歉，您的身份证号已被限制预约');
      }
    }

    // 2. 号源校验
    if (data.departmentId && data.date && data.timeSlot) {
      const quota = await this.checkQuota(data.departmentId, data.departmentName || '', data.date, data.timeSlot);
      if (!quota.ok) {
        throw new Error(quota.reason === '该日期为节假日，暂停接诊'
          ? quota.reason
          : `该时段号源已满，剩余 ${quota.remaining}，请选择其他时间`);
      }
    }

    const client = getSupabaseClient();
    const { data: inserted, error } = await client
      .from(this.table)
      .insert({
        patient_name: data.patientName,
        patient_phone: data.patientPhone,
        patient_id_card: data.patientIdCard,
        department_id: data.departmentId,
        department_name: data.departmentName,
        doctor_id: data.doctorId,
        doctor_name: data.doctorName,
        doctor_title: data.doctorTitle,
        date: data.date,
        time_slot: data.timeSlot,
        status: 'confirmed',
      })
      .select()
      .single();
    if (error) throw new Error(`预约失败: ${error.message}`);
    return this.mapRow(inserted as any);
  }

  async findAll(limit = 500): Promise<Appointment[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(this.table)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error(`查询预约失败: ${error.message}`);
    return (data ?? []).map((r: any) => this.mapRow(r));
  }

  /** 管理员查询，支持按日期 + 科室过滤 */
  async findAllByFilter(query: { date?: string; departmentId?: string; status?: string }) {
    let builder = getSupabaseClient()
      .from(this.table)
      .select('*');
    if (query.date) builder = builder.eq('date', query.date);
    if (query.departmentId) builder = builder.eq('department_id', query.departmentId);
    if (query.status) builder = builder.eq('status', query.status);
    const { data, error } = await builder.order('created_at', { ascending: false }).limit(500);
    if (error) throw new Error(`查询预约失败: ${error.message}`);
    return (data ?? []).map((r: any) => this.mapRow(r));
  }

  async findByPhone(phone: string): Promise<Appointment[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(this.table)
      .select('*')
      .eq('patient_phone', phone)
      .order('created_at', { ascending: false });
    if (error) throw new Error(`查询预约失败: ${error.message}`);
    return (data ?? []).map((r: any) => this.mapRow(r));
  }

  async cancel(id: string): Promise<Appointment | null> {
    const client = getSupabaseClient();
    const { data: found, error: findError } = await client
      .from(this.table)
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (findError) throw new Error(`查询预约失败: ${findError.message}`);
    if (!found) return null;

    const { data: updated, error } = await client
      .from(this.table)
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`取消预约失败: ${error.message}`);
    return this.mapRow(updated as any);
  }

  async getStats() {
    const client = getSupabaseClient();
    const { count: total, error: e1 } = await client.from(this.table).select('*', { count: 'exact', head: true });
    const { count: confirmed, error: e2 } = await client.from(this.table).select('*', { count: 'exact', head: true }).eq('status', 'confirmed');
    const { count: cancelled, error: e3 } = await client.from(this.table).select('*', { count: 'exact', head: true }).eq('status', 'cancelled');
    if (e1 || e2 || e3) throw new Error('统计预约失败');
    return { total: total ?? 0, confirmed: confirmed ?? 0, cancelled: cancelled ?? 0 };
  }

  /** 预约统计（按日期） */
  async getDailyStats() {
    const client = getSupabaseClient();
    const { data, error } = await client.from(this.table).select('date, status, department_name').limit(1000);
    if (error) throw new Error(`统计失败: ${error.message}`);
    const map = new Map<string, { total: number; confirmed: number; cancelled: number }>();
    for (const r of data ?? []) {
      const date = (r as any).date;
      if (!map.has(date)) map.set(date, { total: 0, confirmed: 0, cancelled: 0 });
      const item = map.get(date)!;
      item.total++;
      if ((r as any).status === 'confirmed') item.confirmed++;
      if ((r as any).status === 'cancelled') item.cancelled++;
    }
    return Array.from(map.entries())
      .map(([date, s]) => ({ date, ...s }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  private mapRow(r: any): Appointment {
    return {
      id: r.id,
      patientName: r.patient_name,
      patientPhone: r.patient_phone,
      patientIdCard: r.patient_id_card,
      departmentId: r.department_id,
      departmentName: r.department_name,
      doctorId: r.doctor_id,
      doctorName: r.doctor_name,
      doctorTitle: r.doctor_title,
      date: r.date,
      timeSlot: r.time_slot,
      status: r.status,
      createdAt: r.created_at,
    };
  }
}