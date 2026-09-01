// 模拟数据 - 乡镇卫生院
import Taro from '@tarojs/taro'

export interface Department {
  id: string
  name: string
  description: string
  icon: string
  location: string
}

export interface Doctor {
  id: string
  name: string
  departmentId: string
  departmentName: string
  title: string
  specialty: string
  avatar: string
  introduction: string
}

export interface TimeSlot {
  id: string
  doctorId: string
  date: string
  period: 'morning' | 'afternoon'
  total: number
  remaining: number
}

export interface Announcement {
  id: string
  title: string
  date: string
}

export interface HealthArticle {
  id: string
  title: string
  summary: string
  date: string
  category: string
}

export interface Appointment {
  id: string
  appointmentNo: string
  patientName: string
  patientPhone: string
  patientIdCard: string
  departmentId: string
  departmentName: string
  doctorId: string
  doctorName: string
  doctorTitle: string
  date: string
  period: 'morning' | 'afternoon'
  status: 'pending' | 'completed' | 'cancelled'
  createTime: string
  location: string
}

export interface Patient {
  id: string
  name: string
  phone: string
  idCard: string
  relation: string
  isDefault: boolean
}

// 科室数据
export const departments: Department[] = [
  { id: 'd1', name: '内科', description: '常见病、多发病的内科诊治，包括感冒发热、高血压、糖尿病、冠心病等', icon: 'Stethoscope', location: '门诊楼二楼' },
  { id: 'd2', name: '外科', description: '常见外伤处理、小手术、脓肿切开引流、清创缝合等', icon: 'Scissors', location: '门诊楼二楼' },
  { id: 'd3', name: '儿科', description: '儿童常见病诊治、预防接种、儿童体检、生长发育评估', icon: 'Baby', location: '门诊楼一楼' },
  { id: 'd4', name: '中医科', description: '中医内科、针灸推拿、拔罐理疗、中药调理', icon: 'Leaf', location: '门诊楼三楼' },
  { id: 'd5', name: '全科', description: '常见病首诊、慢性病管理、健康咨询、转诊服务', icon: 'HeartPulse', location: '门诊楼一楼' },
  { id: 'd6', name: '妇幼保健', description: '孕产妇保健、儿童保健、妇女病普查、产前检查', icon: 'Heart', location: '保健楼一楼' },
  { id: 'd7', name: '预防接种', description: '国家免疫规划疫苗接种、儿童入托入学查验、成人疫苗接种', icon: 'Syringe', location: '保健楼二楼' },
  { id: 'd8', name: '口腔科', description: '拔牙、补牙、洗牙、口腔检查、义齿修复', icon: 'Smile', location: '门诊楼一楼' },
]

// 医生数据
export const doctors: Doctor[] = [
  { id: 'doc1', departmentId: 'd1', departmentName: '内科', name: '张建国', title: '副主任医师', specialty: '高血压、糖尿病、冠心病等慢性病诊治', avatar: '', introduction: '从医25年，擅长内科常见病、多发病的诊治，尤其在慢性病管理方面经验丰富。' },
  { id: 'doc2', departmentId: 'd1', departmentName: '内科', name: '李秀英', title: '主治医师', specialty: '呼吸系统疾病、消化系统疾病', avatar: '', introduction: '从医15年，对呼吸道感染、胃肠炎等常见病有丰富经验。' },
  { id: 'doc3', departmentId: 'd2', departmentName: '外科', name: '王大明', title: '副主任医师', specialty: '外伤处理、普外小手术、骨折初步处理', avatar: '', introduction: '从医20年，外科临床经验丰富，操作规范细致。' },
  { id: 'doc4', departmentId: 'd3', departmentName: '儿科', name: '陈慧芳', title: '主治医师', specialty: '儿童常见病、新生儿疾病、儿童保健', avatar: '', introduction: '从医12年，温柔耐心，深受家长和小患儿信赖。' },
  { id: 'doc5', departmentId: 'd4', departmentName: '中医科', name: '刘德明', title: '主任中医师', specialty: '中医内科、针灸推拿、颈肩腰腿痛', avatar: '', introduction: '从医30年，祖传中医，擅长运用中西医结合治疗各类慢性病。' },
  { id: 'doc6', departmentId: 'd5', departmentName: '全科', name: '赵晓红', title: '主治医师', specialty: '常见病首诊、慢性病管理、健康体检', avatar: '', introduction: '全科医学硕士，从医10年，注重健康管理和疾病预防。' },
  { id: 'doc7', departmentId: 'd6', departmentName: '妇幼保健', name: '孙丽萍', title: '副主任医师', specialty: '孕产妇保健、高危妊娠管理、妇女常见病', avatar: '', introduction: '从医18年，在孕产妇保健和妇女健康管理方面经验丰富。' },
  { id: 'doc8', departmentId: 'd7', departmentName: '预防接种', name: '周志华', title: '主管护师', specialty: '预防接种、疫苗管理、接种反应处理', avatar: '', introduction: '从事预防接种工作15年，操作规范，态度亲切。' },
  { id: 'doc9', departmentId: 'd8', departmentName: '口腔科', name: '吴强', title: '主治医师', specialty: '拔牙、补牙、牙周病治疗、口腔修复', avatar: '', introduction: '从医8年，技术娴熟，注重无痛操作。' },
]

// 生成未来7天的号源
function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []
  const today = new Date()

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    doctors.forEach(doc => {
      const morningTotal = Math.floor(Math.random() * 10) + 5
      const afternoonTotal = Math.floor(Math.random() * 8) + 3
      slots.push({
        id: `${doc.id}-${dateStr}-morning`,
        doctorId: doc.id,
        date: dateStr,
        period: 'morning',
        total: morningTotal,
        remaining: Math.floor(Math.random() * morningTotal),
      })
      slots.push({
        id: `${doc.id}-${dateStr}-afternoon`,
        doctorId: doc.id,
        date: dateStr,
        period: 'afternoon',
        total: afternoonTotal,
        remaining: Math.floor(Math.random() * afternoonTotal),
      })
    })
  }
  return slots
}

export const timeSlots: TimeSlot[] = generateTimeSlots()

// 公告数据
export const announcements: Announcement[] = [
  { id: 'a1', title: '通知：春节期间（1月28日-2月4日）门诊正常开诊，急诊24小时值班', date: '2025-01-20' },
  { id: 'a2', title: '免费体检：65岁以上老年人免费健康体检，请携带身份证前往', date: '2025-01-18' },
  { id: 'a3', title: '新增口腔科周末门诊，每周六上午8:00-12:00开诊', date: '2025-01-15' },
  { id: 'a4', title: '流感高发季节提醒：请做好个人防护，建议接种流感疫苗', date: '2025-01-10' },
]

// 健康宣教资讯
export const healthArticles: HealthArticle[] = [
  { id: 'h1', title: '冬季预防感冒的小妙招', summary: '冬季是感冒高发季节，老年人和儿童更需注意防护。保持室内通风、勤洗手、适当运动，都能有效预防感冒...', date: '2025-01-20', category: '季节保健' },
  { id: 'h2', title: '高血压患者的饮食注意事项', summary: '高血压患者应低盐低脂饮食，多吃蔬菜水果，控制体重，坚持适量运动，遵医嘱按时服药...', date: '2025-01-18', category: '慢性病管理' },
  { id: 'h3', title: '儿童冬季保健知识', summary: '冬季儿童容易患上呼吸道感染、腹泻等疾病。家长应注意给孩子保暖，合理膳食，增强免疫力...', date: '2025-01-15', category: '儿童保健' },
  { id: 'h4', title: '老年人防跌倒指南', summary: '跌倒是老年人意外伤害的首位原因。居家环境要防滑、照明充足，起身动作要缓慢，适当锻炼增强平衡能力...', date: '2025-01-12', category: '老年保健' },
  { id: 'h5', title: '糖尿病足的日常护理', summary: '糖尿病患者要特别注意足部护理，每天检查双脚，穿合适的鞋袜，定期监测血糖，预防糖尿病足的发生...', date: '2025-01-10', category: '慢性病管理' },
]

// 就诊指南数据
export const visitingGuide = {
  outpatientTime: '周一至周五 8:00-11:30, 14:00-17:00\n周六 8:00-12:00（仅口腔科、全科）\n急诊 24 小时',
  process: '1. 挂号（窗口或微信预约）\n2. 候诊（按叫号顺序就诊）\n3. 就诊（医生问诊检查）\n4. 缴费（窗口或医保结算）\n5. 取药/检查\n6. 离院',
  insurance: '本院已开通城乡居民医保（新农合）直接结算\n支持城镇职工医保刷卡结算\n慢性病门诊报销需提前办理慢病证\n异地就医需提前办理转诊手续',
  transport: '地址：XX镇XX路168号\n公交：镇公交1路、2路到"卫生院站"下车\n自驾：镇中心小学往东200米，路南侧有免费停车场',
}

// 医院简介
export const hospitalInfo = {
  name: 'XX镇卫生院',
  summary: 'XX镇卫生院始建于1958年，是一所集医疗、预防、保健、康复、健康教育为一体的综合性乡镇卫生院。经过60余年的发展，现已成为服务全镇3.2万居民的基层医疗卫生机构。\n\n卫生院占地面积8000平方米，建筑面积5200平方米，设有门诊楼和保健楼各一栋。配备有数字化X线摄影系统（DR）、彩超、全自动生化分析仪、心电图机等先进设备。\n\n全院现有职工56人，其中高级职称5人，中级职称18人。开设内科、外科、儿科、中医科、全科、口腔科、妇幼保健、预防接种等科室，年门诊量约8万人次。',
  serviceScope: '基本医疗服务、基本公共卫生服务、预防接种、妇幼保健、慢性病管理、健康教育、康复理疗、中医药服务等。',
  phone: '0571-88888888',
  emergencyPhone: '120',
  address: 'XX镇XX路168号',
}

// 预约相关工具函数
const APPOINTMENT_STORAGE_KEY = 'appointments'
const PATIENT_STORAGE_KEY = 'patients'
const FAVORITE_STORAGE_KEY = 'favorites'

export function getAppointments(): Appointment[] {
  try {
    return Taro.getStorageSync(APPOINTMENT_STORAGE_KEY) || []
  } catch {
    return []
  }
}

export function saveAppointment(appointment: Appointment): void {
  const list = getAppointments()
  list.unshift(appointment)
  Taro.setStorageSync(APPOINTMENT_STORAGE_KEY, list)
}

export function cancelAppointment(appointmentId: string): void {
  const list = getAppointments().map(a =>
    a.id === appointmentId ? { ...a, status: 'cancelled' as const } : a
  )
  Taro.setStorageSync(APPOINTMENT_STORAGE_KEY, list)
}

// 就诊人管理
export function getPatients(): Patient[] {
  try {
    return Taro.getStorageSync(PATIENT_STORAGE_KEY) || []
  } catch {
    return []
  }
}

export function savePatient(patient: Patient): void {
  const list = getPatients()
  const idx = list.findIndex(p => p.id === patient.id)
  if (idx >= 0) {
    list[idx] = patient
  } else {
    list.push(patient)
  }
  Taro.setStorageSync(PATIENT_STORAGE_KEY, list)
}

export function deletePatient(patientId: string): void {
  const list = getPatients().filter(p => p.id !== patientId)
  Taro.setStorageSync(PATIENT_STORAGE_KEY, list)
}

// 收藏管理
export function getFavorites(): string[] {
  try {
    return Taro.getStorageSync(FAVORITE_STORAGE_KEY) || []
  } catch {
    return []
  }
}

export function toggleFavorite(articleId: string): boolean {
  const list = getFavorites()
  const idx = list.indexOf(articleId)
  if (idx >= 0) {
    list.splice(idx, 1)
    Taro.setStorageSync(FAVORITE_STORAGE_KEY, list)
    return false
  } else {
    list.push(articleId)
    Taro.setStorageSync(FAVORITE_STORAGE_KEY, list)
    return true
  }
}

export function isFavorited(articleId: string): boolean {
  return getFavorites().includes(articleId)
}

// 生成预约单号
export function generateAppointmentNo(): string {
  const now = new Date()
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `YY${dateStr}${random}`
}

// 获取日期显示文本
export function getDateDisplay(dateStr: string): string {
  const date = new Date(dateStr)
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekDay = weekDays[date.getDay()]
  return `${month}月${day}日 ${weekDay}`
}
