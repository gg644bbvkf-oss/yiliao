import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { HolidayService } from '@/holiday/holiday.service';

export interface QuotaSetting {
  id?: string;
  departmentId: string;
  departmentName: string;
  date: string;
  morningQuota: number;
  afternoonQuota: number;
  isHoliday: boolean;
}

export interface BlacklistEntry {
  id?: string;
  name: string;
  idCard: string;
  reason?: string;
  createdAt?: string;
}

@Injectable()
export class AdminService {
  constructor(private readonly holidayService: HolidayService) {}

  /** 管理员识别：按手机号检查是否管理员 */
  async isAdmin(phone: string): Promise<boolean> {
    const client = getSupabaseClient();
    const { count, error } = await client
      .from('admins')
      .select('*', { count: 'exact', head: true })
      .eq('phone', phone);
    if (error) throw new Error(`识别管理员失败: ${error.message}`);
    return (count ?? 0) > 0;
  }

  /** 统计某科室各日期的时段预约数 */
  async getBookedStats(departmentId: string, dates: string[]): Promise<Record<string, { 上午: number; 下午: number }>> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('appointments')
      .select('date, time_slot')
      .eq('department_id', departmentId)
      .in('date', dates)
      .neq('status', 'cancelled');
    if (error) throw new Error(`统计预约失败: ${error.message}`);
    const map: Record<string, { 上午: number; 下午: number }> = {};
    for (const r of (data ?? []) as any[]) {
      const key = r.date;
      if (!map[key]) map[key] = { 上午: 0, 下午: 0 };
      if (r.time_slot === '上午') map[key]['上午'] += 1;
      else if (r.time_slot === '下午') map[key]['下午'] += 1;
    }
    return map;
  }

  /** 号源查询：未来N天的每日号源 + 剩余。
   *  全院节假日（holidays 表）优先级最高：节假日当天上/下午号源统一为 0。 */
  async listQuota(departmentId: string, departmentName: string, dates: string[], booked: Record<string, { 上午: number; 下午: number }>) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('quota_settings')
      .select('*')
      .eq('department_id', departmentId)
      .in('date', dates);
    if (error) throw new Error(`查询号源失败: ${error.message}`);
    const setMap = new Map<string, any>((data ?? []).map((r: any) => [r.date, r]));

    // 全院节假日（含自动法定节假日与管理员手动调整）
    const globalHolidays = await this.holidayService.listHolidays(dates);

    return dates.map((date) => {
      const set = setMap.get(date);
      const global = globalHolidays.find((h) => h.date === date);
      const isHoliday = (global && global.isHoliday) || (!!set?.is_holiday && !global);
      const b = booked[date] || { 上午: 0, 下午: 0 };
      if (isHoliday) {
        return {
          date,
          morningQuota: 0,
          afternoonQuota: 0,
          morningLeft: 0,
          afternoonLeft: 0,
          isHoliday: true,
          holidayName: global?.name || '节假日停诊',
        };
      }
      const morning = set?.morning_quota ?? 20;
      const afternoon = set?.afternoon_quota ?? 15;
      return {
        date,
        morningQuota: morning,
        afternoonQuota: afternoon,
        morningLeft: Math.max(0, morning - b['上午']),
        afternoonLeft: Math.max(0, afternoon - b['下午']),
        isHoliday: false,
      };
    });
  }

  /** 设置号源（upsert）。
   *  节假日标记同时写入全院 holidays 表（全院生效），普通号源只写科室 quota_settings。 */
  async setQuota(input: QuotaSetting) {
    // 1. 全院节假日同步（无论是否传 departmentId，节假日都是全院概念）
    await this.holidayService.setHoliday(input.date, input.isHoliday, input.isHoliday ? '节假日停诊' : '', 'manual');

    const client = getSupabaseClient();
    const existing = await client
      .from('quota_settings')
      .select('*')
      .eq('department_id', input.departmentId)
      .eq('date', input.date)
      .maybeSingle();
    if (existing.error) throw new Error(`查询号源失败: ${existing.error.message}`);
    const payload = {
      department_id: input.departmentId,
      department_name: input.departmentName,
      date: input.date,
      morning_quota: input.isHoliday ? 0 : input.morningQuota,
      afternoon_quota: input.isHoliday ? 0 : input.afternoonQuota,
      is_holiday: input.isHoliday,
    };
    let res;
    if (existing.data) {
      res = await client.from('quota_settings').update(payload).eq('id', (existing.data as any).id).select().single();
    } else {
      res = await client.from('quota_settings').insert(payload).select().single();
    }
    if (res.error) throw new Error(`设置号源失败: ${res.error.message}`);
    return res.data;
  }

  /** 批量设置未来默认号源 */
  async ensureQuotaForRange(departmentId: string, departmentName: string, dates: string[]) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('quota_settings')
      .select('*')
      .eq('department_id', departmentId)
      .in('date', dates);
    if (error) throw new Error(`查询号源失败: ${error.message}`);
    const existing = new Set((data ?? []).map((r: any) => r.date));
    const toInsert = dates.filter((d) => !existing.has(d)).map((date) => ({
      department_id: departmentId,
      department_name: departmentName,
      date,
      morning_quota: 10,
      afternoon_quota: 5,
      is_holiday: false,
    }));
    if (toInsert.length > 0) {
      const { error: insErr } = await client.from('quota_settings').insert(toInsert);
      if (insErr) throw new Error(`初始化号源失败: ${insErr.message}`);
    }
    return true;
  }

  /** 黑名单列表 */
  async listBlacklist() {
    const client = getSupabaseClient();
    const { data, error } = await client.from('blacklist').select('*').order('created_at', { ascending: false }).limit(500);
    if (error) throw new Error(`查询黑名单失败: ${error.message}`);
    return (data ?? []).map((r: any) => ({
      id: r.id,
      name: r.name,
      idCard: r.id_card,
      reason: r.reason,
      createdAt: r.created_at,
    } as BlacklistEntry));
  }

  /** 添加黑名单 */
  async addBlacklist(input: { name: string; idCard: string; reason?: string }) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('blacklist')
      .insert({ name: input.name, id_card: input.idCard, reason: input.reason || '' })
      .select()
      .single();
    if (error) throw new Error(`添加黑名单失败: ${error.message}`);
    return data;
  }

  /** 移除黑名单 */
  async removeBlacklist(id: string) {
    const client = getSupabaseClient();
    const { error } = await client.from('blacklist').delete().eq('id', id);
    if (error) throw new Error(`移除黑名单失败: ${error.message}`);
    return true;
  }

  /** 检查身份证是否在黑名单 */
  async checkBlacklist(idCard: string): Promise<boolean> {
    const client = getSupabaseClient();
    const { count, error } = await client
      .from('blacklist')
      .select('*', { count: 'exact', head: true })
      .eq('id_card', idCard);
    if (error) throw new Error(`查询黑名单失败: ${error.message}`);
    return (count ?? 0) > 0;
  }
}