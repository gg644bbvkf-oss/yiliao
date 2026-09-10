import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { Lunar, Solar } from 'lunar-typescript';

export interface HolidayRow {
  date: string; // YYYY-MM-DD
  name: string;
  isHoliday: boolean;
  source?: string; // auto=系统法定 / manual=管理员手动
}

/** 格式化公历日期为 YYYY-MM-DD */
function fmt(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** 农历日期转公历（lunar 月份/日期），返回 YYYY-MM-DD */
function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number): string {
  const solar = Lunar.fromYmd(lunarYear, lunarMonth, lunarDay).getSolar();
  return fmt(solar.getYear(), solar.getMonth(), solar.getDay());
}

/** 春节正月初一公历日期 */
function springFestival(y: number): string {
  return lunarToSolar(y, 1, 1);
}

/** 端午（农历五月初五） */
function dragonBoat(y: number): string {
  return lunarToSolar(y, 5, 5);
}

/** 中秋（农历八月十五） */
function midAutumn(y: number): string {
  return lunarToSolar(y, 8, 15);
}

/** 在某个基准日期上偏移 days 天，返回 YYYY-MM-DD（自动处理跨年、大小月） */
function addDays(baseStr: string, days: number): string {
  const d = new Date(baseStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return fmt(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/** 清明节精确日期（4/4 或 4/5，节气当天） */
function qingming(y: number): string {
  for (let day = 4; day <= 5; day++) {
    const lunar = Solar.fromYmd(y, 4, day).getLunar();
    if (lunar.getJieQi() === '清明') return fmt(y, 4, day);
  }
  return fmt(y, 4, 5); // 兜底
}

/**
 * 生成某一年度的法定节假日（含多日假期）。
 * 假期天数（核心法定，不含调休补班；调休可由管理员后台覆盖）：
 *  元旦 1天、春节 除夕+初一至初三 共4天、清明 1天、劳动 1天、端午 1天、中秋 1天、国庆 7天。
 * 说明：法定调休具体安排由国务院年初公布，这里按节日核心假日停诊；
 *       管理员可在后台对任意日期一键切换"节假日/正常接诊"覆盖。
 */
function holidaysForYear(y: number): HolidayRow[] {
  const acc: HolidayRow[] = [];
  const add = (baseStr: string, fromOffset: number, toOffset: number, name: string) => {
    for (let i = fromOffset; i <= toOffset; i++) {
      const date = addDays(baseStr, i);
      acc.push({ date, name, isHoliday: true, source: 'auto' });
    }
  };

  // 元旦：1/1 当天
  add(fmt(y, 1, 1), 0, 0, '元旦');
  // 春节：除夕(-1) + 初一至初三(0~2)
  add(springFestival(y), -1, 2, '春节');
  // 清明：节气当天
  add(qingming(y), 0, 0, '清明节');
  // 劳动节：5/1 当天
  add(fmt(y, 5, 1), 0, 0, '劳动节');
  // 端午：农历五月初五当天
  add(dragonBoat(y), 0, 0, '端午节');
  // 中秋：农历八月十五当天
  add(midAutumn(y), 0, 0, '中秋节');
  // 国庆：10/1 ~ 10/7
  add(fmt(y, 10, 1), 0, 6, '国庆节');

  return acc;
}

/**
 * 生成从今天起未来一年区间内的法定节假日（跨年不重复）。
 */
function computeLegalHolidays(fromDate: Date): HolidayRow[] {
  const todayStr = fmt(fromDate.getFullYear(), fromDate.getMonth() + 1, fromDate.getDate());
  const end = new Date(fromDate);
  end.setFullYear(end.getFullYear() + 1);
  const endStr = fmt(end.getFullYear(), end.getMonth() + 1, end.getDate());

  const map = new Map<string, HolidayRow>();
  // 覆盖上一年（处理年初已发生但跨年窗口需要的节日）到明年
  for (let y = fromDate.getFullYear() - 1; y <= fromDate.getFullYear() + 1; y++) {
    for (const h of holidaysForYear(y)) {
      if (!map.has(h.date)) map.set(h.date, h);
    }
  }

  return Array.from(map.values())
    .filter((h) => h.date >= todayStr && h.date <= endStr)
    .sort((a, b) => a.date.localeCompare(b.date));
}

@Injectable()
export class HolidayService {
  private table = 'holidays';

  /** 查询某日是否全院节假日 */
  async getHolidayDate(date: string): Promise<HolidayRow | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(this.table)
      .select('*')
      .eq('date', date)
      .maybeSingle();
    if (error) throw new Error(`查询节假日失败: ${error.message}`);
    if (!data) return null;
    const row = data as any;
    return { date: row.date, name: row.name || '', isHoliday: !!row.is_holiday, source: row.source };
  }

  /** 查询多个日期的节假日记录 */
  async listHolidays(dates: string[]): Promise<HolidayRow[]> {
    if (!dates.length) return [];
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(this.table)
      .select('*')
      .in('date', dates);
    if (error) throw new Error(`查询节假日失败: ${error.message}`);
    return (data ?? []).map((r: any) => ({
      date: r.date,
      name: r.name || '',
      isHoliday: !!r.is_holiday,
      source: r.source,
    }));
  }

  /** 设置某日为节假日 / 改回正常接诊（全院生效，upsert） */
  async setHoliday(date: string, isHoliday: boolean, name = '', source = 'manual'): Promise<HolidayRow> {
    const client = getSupabaseClient();
    const existing = await client.from(this.table).select('*').eq('date', date).maybeSingle();
    if (existing.error) throw new Error(`查询节假日失败: ${existing.error.message}`);
    const payload = {
      date,
      name: isHoliday ? name || '节假日停诊' : '',
      is_holiday: isHoliday,
      source,
      updated_at: new Date().toISOString(),
    };
    let res;
    if (existing.data) {
      res = await client.from(this.table).update(payload).eq('id', (existing.data as any).id).select().single();
    } else {
      res = await client.from(this.table).insert(payload).select().single();
    }
    if (res.error) throw new Error(`设置节假日失败: ${res.error.message}`);
    const row = res.data as any;
    return { date: row.date, name: row.name || '', isHoliday: !!row.is_holiday, source: row.source };
  }

  /** 初始化未来一年的法定节假日（已存在的日期不覆盖，保留管理员手动调整） */
  async ensureHolidays(): Promise<{ added: number; total: number }> {
    const legal = computeLegalHolidays(new Date());
    const client = getSupabaseClient();
    const { data: existing, error } = await client
      .from(this.table)
      .select('date')
      .in('date', legal.map((h) => h.date));
    if (error) throw new Error(`查询节假日失败: ${error.message}`);
    const existingSet = new Set((existing ?? []).map((r: any) => r.date));
    const toInsert = legal
      .filter((h) => !existingSet.has(h.date))
      .map((h) => ({
        date: h.date,
        name: h.name,
        is_holiday: true,
        source: 'auto',
      }));
    if (toInsert.length > 0) {
      const { error: insErr } = await client.from(this.table).insert(toInsert);
      if (insErr) throw new Error(`初始化节假日失败: ${insErr.message}`);
    }
    return { added: toInsert.length, total: legal.length };
  }
}
