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
  { id: 'd1', name: '全科门诊', description: '常见病首诊、慢性病管理、健康咨询、转诊服务', icon: 'HeartPulse', location: '门诊楼一层' },
  { id: 'd2', name: '中医门诊', description: '中医内科诊治、针灸推拿、拔罐刮痧、中药调理', icon: 'Leaf', location: '门诊楼三层' },
  { id: 'd3', name: '预防接种门诊', description: '国家免疫规划疫苗接种、儿童入托入学查验、成人疫苗接种', icon: 'Syringe', location: '门诊楼一层' },
  { id: 'd4', name: '中医馆', description: '中医特色诊疗，开展针灸、推拿、拔罐、刮痧、按摩牵引、熏蒸、中医正骨手法复位、小针刀等10类25项中医药适宜技术', icon: 'Flower2', location: '门诊楼三层' },
  { id: 'd5', name: '康复训练中心', description: '康复理疗、平衡训练、牵引治疗、中医超声治疗、红外线治疗等康复治疗', icon: 'Dumbbell', location: '门诊楼三层' },
  { id: 'd6', name: '公共卫生科', description: '居民健康档案管理、健康教育、传染病防控、慢性病管理', icon: 'ShieldCheck', location: '门诊楼三层' },
  { id: 'd7', name: '药剂科', description: '中西药品调配、用药指导、药品管理', icon: 'Pill', location: '门诊楼一层' },
  { id: 'd8', name: '功能科', description: 'B超检查、心电图检查、生化检验、血细胞分析等检查检验服务', icon: 'Activity', location: '门诊楼二层' },
]

// 医生数据
export const doctors: Doctor[] = [
  { id: 'doc1', departmentId: 'd1', departmentName: '内科', name: '谭斌', title: '院长、主治医师', specialty: '针灸、中西医治疗内外妇儿常见病、脾胃病、中风后遗症、面瘫、心脑血管病、颈腰椎病、骨关节疼痛、带状疱疹、疑难杂症等', avatar: '', introduction: '咸阳市优秀医师，咸阳市中医药学会脾胃病专业委员会委员、本科学历，先后毕业于陕西省中医学校中医医士、延安大学临床医学专业、陕西中医药大学临床医学专业，从事临床诊疗20余年，擅长运用针灸、中西医治疗内外妇儿常见病、脾胃病、中风后遗症、面瘫、心脑血管病、颈腰椎病、骨关节疼痛、带状疱疹、疑难杂症等病症。曾多次被县委县政府评为优秀医生及优秀专业技术人才，被旬邑县卫健局评为健康卫士、十佳医师、旬邑好医生，在县域内群众中享有较高的声誉，多次收到群众送来感谢锦旗。' },
  { id: 'doc2', departmentId: 'd1', departmentName: '内科', name: '燕萌', title: '内科主治医师', specialty: '心血管疾病、呼吸系统疾病、消化系统疾病、内分泌系统疾病', avatar: '', introduction: '燕萌，女，36岁，本科学历，毕业于延安大学，临床医学专业，内科主治医师，曾先后在旬邑县医院及郑家镇卫生院工作，熟练掌握内科常见疾病的诊断和治疗方法，如心血管疾病、呼吸系统疾病、消化系统疾病、内分泌系统疾病等。具备良好的医患沟通能力，能够耐心倾听患者的诉求，为患者提供专业、易懂的医疗建议。' },
  { id: 'doc3', departmentId: 'd1', departmentName: '内科', name: '郑瑶瑶', title: '主治医师', specialty: '消化系统及呼吸系统各类疾病诊治', avatar: '', introduction: '郑瑶瑶，女，34岁，西安交通大学临床医学专业，主治医师，从事临床工作12年，先后工作于福建省将乐县疾控中心、张洪中心卫生院、旬邑县医院，赴泰兴市人民医院进修学习，参加各类学习培训，多次评为旬邑县先进工作者，对待工作认真细致，对待患者细心负责，对内科各类常见疾病有丰富的工作经验，尤其擅长消化系统及呼吸系统各类疾病诊治。' },
  { id: 'doc4', departmentId: 'd1', departmentName: '内科', name: '杨妮', title: '内科主治医师', specialty: '糖尿病、高血压、艾滋病、丙肝等慢性病和传染病的预防控制', avatar: '', introduction: '杨妮，女，37岁，内科主治医师，本科学历，学士学位，临床医学专业，毕业于西安医学院。2012年参加工作，曾先后担任县疾病预防控制中心慢病科副科长、流病科科长，主要从事糖尿病、高血压、艾滋病、丙肝等慢性病和传染病的预防控制工作。2016年参加省疾控中心组织的现场流行病学培训班学习一年。2020年、2022年分别参与西咸国际机场、西安市新冠疫情流调工作。期间工作认真、爱岗敬业、严谨细致、能力突出，连续多次被评为先进个人。' },
  { id: 'doc5', departmentId: 'd3', departmentName: '儿科', name: '文丽娟', title: '儿科主治医师', specialty: '儿童生长发育、儿科常见病诊治', avatar: '', introduction: '文丽娟，本科学历，儿科主治医师。2015年毕业于陕西中医药大学临床医学专业，于2015年至2025年在旬邑县妇计中心内儿科工作，曾于宝鸡市妇幼保健院进修学习儿童生长发育相关知识，并于2022年取得儿科主治医师职称。' },
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
  outpatientTime: '周一至周五 8:00-11:30, 14:00-17:00\n周六 8:00-12:00\n急诊 24 小时',
  process: '1. 挂号（窗口或微信预约）\n2. 候诊（按叫号顺序就诊）\n3. 就诊（医生问诊检查）\n4. 缴费（窗口或医保结算）\n5. 取药/检查\n6. 离院',
  insurance: '本院已开通城乡居民医保（新农合）直接结算\n支持城镇职工医保刷卡结算\n慢性病门诊报销需提前办理慢病证\n异地就医需提前办理转诊手续',
  transport: '地址：旬邑县阳光大道幽风庭韵小区西侧\n公交：县城公交到"幽风庭韵站"下车\n自驾：阳光大道幽风庭韵小区西侧，院内设有免费停车场',
}

// 医院简介
export const hospitalInfo = {
  name: '旬邑县城关镇卫生院',
  image: 'https://coze-coding-project.tos.coze.site/coze_storage_7680476130855649315/hospital-intro_589e337a.png?sign=1790850198-8a97c7100c-0-0009f0d9899e5c36ee07b22336e7a9b1baf5b7593ca0dffb297344f3183ebd3f',
  summary: '旬邑县城关镇卫生院，位于县阳光大道、幽风庭韵小区西侧，是县委、县政府立足于满足县城东区居民看病就医需求，在幽风庭韵小区临街门面房基础上改建而成，项目于2024年8月开工建设、2024年12月建成完工，总建筑面积2185平方米，共分为三层，一层为门诊、中西医药房和预防接种区，二层为检验科和住院病房，三层为康复训练大厅、中医科及办公区，是一家集医疗、预防、保健为一体的公立医疗机构。\n\n医院现有干部职工18人，其中卫生专业技术人员17人、中高级以上职称14人；开设全科门诊、中医门诊、预防接种门诊、中医馆、康复训练中心、公共卫生科、药剂科、功能科等8个科室。开设床位18张，拥有B超机、心电图机、全自动生化分析仪、血细胞分析仪、中医超声治疗仪、红外线治疗仪、平衡训练、牵引治疗等检查检验及康复治疗设备46台；同时，医院门诊大厅设立便民窗口，配置轮椅、担架、热水器、茶杯等便民设施，供给有需要的患者随时取用。\n\n医院以"基础医疗+中医康复"为特色，以中西医常见病的诊断与治疗为基础，可以开展针灸、推拿、拔罐、刮痧、按摩牵引、熏蒸、中医正骨手法复位、小针刀等10类25项中医药适宜技术，为广大患者提供优质、高效、便捷的中医特色诊疗服务。',
  serviceScope: '全科门诊、中医门诊、预防接种门诊、中医馆、康复训练中心、公共卫生科、药剂科、功能科等8个科室。提供基本医疗、预防保健、中医康复、预防接种、慢性病管理等服务。',
  phone: '029-34411120',
  emergencyPhone: '120',
  address: '旬邑县阳光大道幽风庭韵小区西侧',
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
