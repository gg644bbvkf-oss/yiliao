import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  timestamp,
  text,
  varchar,
  integer,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// 系统表（必须保留）
export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 预约记录表
export const appointments = pgTable(
  "appointments",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    patientName: varchar("patient_name", { length: 64 }).notNull(),
    patientPhone: varchar("patient_phone", { length: 32 }).notNull(),
    patientIdCard: varchar("patient_id_card", { length: 32 }).notNull(),
    departmentId: varchar("department_id", { length: 36 }),
    departmentName: varchar("department_name", { length: 64 }),
    doctorId: varchar("doctor_id", { length: 36 }),
    doctorName: varchar("doctor_name", { length: 64 }),
    doctorTitle: varchar("doctor_title", { length: 64 }),
    date: varchar("date", { length: 32 }).notNull(),
    timeSlot: varchar("time_slot", { length: 16 }).notNull(),
    status: varchar("status", { length: 16 }).notNull().default("confirmed"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("appointments_phone_idx").on(table.patientPhone),
    index("appointments_dept_date_idx").on(table.departmentId, table.date),
    index("appointments_date_slot_idx").on(table.date, table.timeSlot),
  ]
);

// 号源设置表
export const quotaSettings = pgTable(
  "quota_settings",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    departmentId: varchar("department_id", { length: 36 }).notNull(),
    departmentName: varchar("department_name", { length: 64 }).notNull(),
    date: varchar("date", { length: 32 }).notNull(),
    morningQuota: integer("morning_quota").notNull().default(10),
    afternoonQuota: integer("afternoon_quota").notNull().default(5),
    isHoliday: boolean("is_holiday").notNull().default(false),
  },
  (table) => [
    index("quota_dept_date_idx").on(table.departmentId, table.date),
  ]
);

// 黑名单表
export const blacklist = pgTable(
  "blacklist",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 64 }).notNull(),
    idCard: varchar("id_card", { length: 32 }).notNull(),
    reason: varchar("reason", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("blacklist_idcard_idx").on(table.idCard),
  ]
);

// 管理员表
export const admins = pgTable(
  "admins",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    phone: varchar("phone", { length: 32 }).notNull(),
    name: varchar("name", { length: 64 }).notNull(),
    role: varchar("role", { length: 32 }).notNull().default("管理员"),
    password: varchar("password", { length: 64 }).notNull().default("123456"),
  },
  (table) => [
    index("admins_phone_idx").on(table.phone),
  ]
);

// 科室表（挂号科室，内容可后台维护）
export const departments = pgTable(
  "departments",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 64 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 64 }).notNull().default("Stethoscope"),
    location: varchar("location", { length: 128 }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    uniqueIndex("departments_name_uq").on(table.name),
  ]
);

// 医生表（医生内容，可后台维护）
export const doctors = pgTable(
  "doctors",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    departmentId: varchar("department_id", { length: 36 }),
    departmentName: varchar("department_name", { length: 64 }),
    name: varchar("name", { length: 64 }).notNull(),
    title: varchar("title", { length: 64 }),
    specialty: text("specialty"),
    introduction: text("introduction"),
    avatar: text("avatar"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    index("doctors_dept_idx").on(table.departmentId),
  ]
);

// 医院内容表（key-value，供管理后台编辑医院简介等）
export const hospitalContent = pgTable(
  "hospital_content",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    key: varchar("key", { length: 64 }).notNull(),
    value: text("value"),
  },
  (table) => [
    uniqueIndex("hospital_content_key_uq").on(table.key),
  ]
);