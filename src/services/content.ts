// 内容数据服务
// 优先请求后端接口（NestJS + Supabase）；当后端不可达时（例如纯静态部署的 H5 / GitHub Pages，
// 无独立后端服务），回退到内置静态快照，保证医院简介、医生介绍、科室、号源等内容仍可正常浏览。
import { Network } from '@/network'

export interface HospitalContent {
  intro: string
  service: string
  image: string
  stats: Array<{ label: string; value: string }>
  phone: string
  address: string
  logo?: string
  lng?: number
  lat?: number
}

export interface DepartmentItem {
  id: string
  name: string
  description: string
  icon: string
  location: string
}

export interface DoctorItem {
  id: string
  name: string
  title: string
  avatar: string
  specialty: string
  introduction: string
  departmentName: string
}

export interface QuotaData {
  morningQuota: number
  morningLeft: number
  afternoonQuota: number
  afternoonLeft: number
  isHoliday?: boolean
  holidayName?: string
}

export interface RollingNewsItem {
  id: string
  content: string
  sortOrder?: number
  fontSize?: string
  color?: string
}

/* ================= 内置静态快照（与当前线上数据保持一致） ================= */

const FALLBACK_STATS = [
  { label: '建筑面积', value: '2185㎡' },
  { label: '职工人数', value: '18人' },
  { label: '中高级职称', value: '14人' },
  { label: '开设床位', value: '18张' },
]

export const FALLBACK_HOSPITAL: HospitalContent = {
  intro:
    '　　旬邑县城关镇卫生院新院区，位于县阳光大道、豳风庭韵小区西侧，是县委、县政府立足于满足县城东区居民看病就医需求，在豳风庭韵小区临街门面房基础上改建而成，项目于2024年8月开工建设、2024年12月建成完工，总建筑面积2185平方米，共分为三层，一层为门诊、中西医药房和预防接种区，二层为检验科和住院病房，三层为康复训练大厅、中医科及办公区，是一家集医疗、预防、保健为一体的公立医疗机构。\n　　医院现有干部职工22人，其中卫生专业技术人员21人、中高级以上职称14人；开设全科门诊、中医门诊、中医馆、康复训练中心、公共卫生科、药剂科、功能科等8个科室。开设床位18张，拥有B超机、心电图机、全自动生化分析仪、血细胞分析仪、中医超声治疗仪、红外线治疗仪、平衡训练、牵引治疗等检查检验及康复治疗设备46台；同时，医院门诊大厅设立便民窗口，配置轮椅、担架、热水器、茶杯等便民设施，供给有需要的患者随时取用。\n　　医院以“基础医疗+中医康复”为特色，以中西医常见病的诊断与治疗为基础，可以开展针灸、推拿、拔罐、刮痧、按摩牵引、熏蒸、中医正骨手法复位、小针刀等10类25项中医药适宜技术，为广大患者提供优质、高效、便捷的中医特色诊疗服务。',
  service:
    '主要开展全科常见病多发病诊治、中医诊疗与康复、住院治疗、儿童保健、健康教育等。',
  image:
    'https://coze-coding-project.tos.coze.site/coze_storage_7680476130855649315/doctor-1790048960049_2a607448.jpg?sign=1792640960-0205dfdfc6-0-183c0a8d2f0281d206812c073a8fea712794e339cc0c1c04e0c991a1ead10e62',
  stats: FALLBACK_STATS,
  phone: '029-37111120',
  address: '陕西省咸阳市旬邑县城关街道阳光大道崔家河文化广场西北侧',
  lng: 108.359737,
  lat: 35.129209,
  logo:
    'https://coze-coding-project.tos.coze.site/coze_storage_7680476130855649315/hospital-logo-1789980647828_fe47daa1.jpg?sign=1792572648-18e442492a-0-d97811916de71e301cfa2c0fea8e2f4065993b5aa06948b8bf6dca82495b7de6',
}

export const FALLBACK_DEPARTMENTS: DepartmentItem[] = [
  { id: 'dept-zhongyi', name: '中医', description: '运用针灸、推拿、拔罐、正骨等中医药适宜技术，治疗颈肩腰腿痛及慢性病调理。', icon: 'Flower2', location: '三楼中医馆' },
  { id: 'dept-quanke', name: '全科', description: '全科常见病、多发病首诊与基本医疗服务', icon: 'Stethoscope', location: '一楼全科门诊' },
  { id: 'dept-zhuyuan', name: '住院', description: '承担住院患者的综合诊疗与康复观察，提供常规疾病住院治疗、术后康复、慢病住院管理等服务。', icon: 'BedDouble', location: '住院楼' },
  { id: 'dept-neike', name: '内科', description: '内科为医院重点科室，开展心血管、呼吸、消化、神经等系统常见病的诊治，配备经验丰富的内科医师团队，为居民提供规范、专业的诊疗服务。', icon: 'HeartPulse', location: '门诊二楼' },
]

export const FALLBACK_DOCTORS: DoctorItem[] = [
  {
    id: 'doc-tanbin',
    name: '谭斌',
    title: '院长 · 主治医师',
    specialty: '针灸、中西医结合治疗',
    introduction:
      '谭斌，主治医师，本科学历，先后毕业于陕西省中医学校中医医士专业、延安大学临床医学专业及陕西中医药大学临床医学专业，具备中西医双重学术背景。现任咸阳市中医药学会脾胃病专业委员会委员，曾获评“咸阳市优秀医师”，2026年荣获“旬邑县第五届劳动模范先进工作者”称号。\n从事临床诊疗工作二十余年，经验丰富，医术精湛。擅长运用传统针灸疗法，融合中西医诊疗思路，辨证施治内科、外科、妇科、儿科常见病及多发病。尤其在脾胃疾病、中风后遗症、面瘫、心脑血管疾病、颈腰椎骨关节病及各类疑难杂症的诊治方面造诣深厚，疗效显著。\n多次被评为旬邑县“优秀专业技术人才”“健康卫士”“十佳医师”“百姓好医生”等，深受患者信赖与好评，屡获锦旗致谢，在当地群众中享有极高声誉。',
    avatar:
      'https://coze-coding-project.tos.coze.site/coze_storage_7680476130855649315/doctor-1788928807207_4af36697.png?sign=1791520807-24027c5852-0-ca563f9849b2f962db601f724f21542507f783e30ccaf2b7145d3825034f0557',
    departmentName: '',
  },
  {
    id: 'doc-yanmeng',
    name: '燕萌',
    title: '内科主治医师',
    specialty: '心血管、呼吸、消化系统疾病',
    introduction:
      '女，36岁，本科学历，毕业于延安大学临床医学专业。曾先后在旬邑县医院及郑家镇卫生院工作，熟练掌握内科常见疾病的诊治方法，如心血管疾病、呼吸系统疾病、消化系统疾病、内分泌系统疾病等。具备良好的医患沟通能力，能够耐心倾听患者诉求，为患者提供专业、易懂的医疗建议。',
    avatar:
      'https://coze-coding-project.tos.coze.site/coze_storage_7680476130855649315/doctor-1788928927447_cc61a81c.png?sign=1791520927-43853d2596-0-914f1b90a0a22dd594db0d1878ddf2b1fb571884b67aaa1365f32c525b8433db',
    departmentName: '',
  },
  {
    id: 'doc-zhengyaoyao',
    name: '郑瑶瑶',
    title: '主治医师',
    specialty: '消化系统及呼吸系统各类疾病诊治',
    introduction:
      '女，34岁，西安交通大学临床医学专业，从事临床工作12年。先后工作于福建省将乐县疾控中心、张洪中心卫生院、旬邑县医院，赴泰兴市人民医院进修学习，参加各类学习培训，多次评为旬邑县先进工作者。对待工作认真细致，对待患者细心负责，对内科各类常见疾病有丰富的工作经验，尤其擅长消化系统及呼吸系统各类疾病诊治。',
    avatar:
      'https://coze-coding-project.tos.coze.site/coze_storage_7680476130855649315/doctor-1788928950181_4cd24d08.png?sign=1791520950-c7ab7751f8-0-986c2b670ac8c5957c7467df659bca1e92ca68909019aece2c588447390e5cdc',
    departmentName: '',
  },
  {
    id: 'doc-yangni',
    name: '杨妮',
    title: '内科主治医师',
    specialty: '糖尿病、高血压等慢性病和传染病预防控制',
    introduction:
      '女，37岁，本科学历、学士学位，临床医学专业，毕业于西安医学院。2012年参加工作，曾先后担任县疾病预防控制中心慢病科副科长、流病科科长，主要从事糖尿病、高血压、艾滋病、丙肝等慢性病和传染病的预防控制工作。2016年参加省疾控中心组织的现场流行病学培训班学习一年。2020年、2022年分别参与西咸国际机场、西安市新冠疫情流调工作。工作认真、爱岗敬业、严谨细致、能力突出，连续多次被评为先进个人。',
    avatar:
      'https://coze-coding-project.tos.coze.site/coze_storage_7680476130855649315/doctor-1788928975140_57ff3d2f.png?sign=1791520975-9ab059129c-0-d50dd713365080698a5c8abfa34d5f8795ed763d149d80c9d1cc18901cb99146',
    departmentName: '',
  },
  {
    id: 'doc-wenlijuan',
    name: '文丽娟',
    title: '儿科主治医师',
    specialty: '儿童生长发育、儿科常见病诊治',
    introduction:
      '本科学历，2015年毕业于陕西中医药大学临床医学专业，于2015年至2025年在旬邑县妇计中心内儿科工作，曾于宝鸡市妇幼保健院进修学习儿童生长发育相关知识，并于2022年取得儿科主治医师职称。',
    avatar:
      'https://coze-coding-project.tos.coze.site/coze_storage_7680476130855649315/doctor-1788928990209_ea75c94a.png?sign=1791520990-1dd2de9bf3-0-43279335e34cd071aea12be81d63b7a2d76fefe19723f5f1ae4aa039858dee2d',
    departmentName: '',
  },
]

// 号源兜底：上午 10 个、下午 5 个（静态环境下默认充足）
export const FALLBACK_QUOTA: QuotaData = {
  morningQuota: 10,
  morningLeft: 10,
  afternoonQuota: 5,
  afternoonLeft: 5,
  isHoliday: false,
}

// 滚动内容兜底（滚动新闻 / 健康知识）
export const FALLBACK_ROLLING: RollingNewsItem[] = [
  { id: 'roll-1', content: '【温馨提示】我院网上预约挂号均不收取任何费用，请勿轻信"卖号代排"行为，如遇请拨 029-37111120 举报。', fontSize: '14', color: '#374151' },
  { id: 'roll-2', content: '【门诊安排】中医门诊坐诊时间：周一至周五 8:30-12:00（节假日除外），请合理安排就诊时间。', fontSize: '14', color: '#374151' },
  { id: 'roll-3', content: '【健康知识】冬季流感高发，注意勤洗手、多通风、接种疫苗，出现发热请及时就医。', fontSize: '14', color: '#374151' },
]

/** 判断响应是否为有效后端数据（静态托管下 /api 会回退返回 index.html 或 404） */
const isApiOk = (res: any): boolean => {
  const status = res?.statusCode
  if (typeof status === 'number' && status >= 400) return false
  const body = res?.data
  // 后端信封模式：{ code, msg, data }
  if (body && typeof body === 'object' && 'code' in body) return body.code === 200
  // 静态托管回退：返回 HTML 字符串
  if (typeof body === 'string' && body.trim().startsWith('<')) return false
  return true
}

/** 医院简介内容 */
export const fetchHospital = async (): Promise<HospitalContent> => {
  try {
    const res = await Network.request({ url: '/api/content/hospital' })
    if (!isApiOk(res)) return FALLBACK_HOSPITAL
    const d = res.data?.data || {}
    let stats = FALLBACK_STATS
    try {
      const parsed = JSON.parse(d.stats || '[]')
      if (Array.isArray(parsed) && parsed.length) stats = parsed
    } catch {
      /* ignore */
    }
    return {
      intro: d.intro || FALLBACK_HOSPITAL.intro,
      service: d.service || FALLBACK_HOSPITAL.service,
      image: d.image || FALLBACK_HOSPITAL.image,
      stats,
      phone: d.phone || FALLBACK_HOSPITAL.phone,
      address: d.address || FALLBACK_HOSPITAL.address,
      logo: d.logo || FALLBACK_HOSPITAL.logo,
      lng: Number(d.lng) || FALLBACK_HOSPITAL.lng,
      lat: Number(d.lat) || FALLBACK_HOSPITAL.lat,
    }
  } catch {
    return FALLBACK_HOSPITAL
  }
}

/** 科室列表 */
export const fetchDepartments = async (): Promise<DepartmentItem[]> => {
  try {
    const res = await Network.request({ url: '/api/content/departments' })
    if (!isApiOk(res)) return FALLBACK_DEPARTMENTS
    const list = res.data?.data
    if (!Array.isArray(list) || list.length === 0) return FALLBACK_DEPARTMENTS
    const mapped: DepartmentItem[] = list.map((d: any) => ({
      id: d.id,
      name: d.name || '',
      description: d.description || '',
      icon: d.icon || 'Stethoscope',
      location: d.location || '',
    }))
    // 固定科室展示顺序：中医在前、全科在后
    const order = ['中医', '全科']
    mapped.sort((a, b) => {
      const ia = order.indexOf(a.name)
      const ib = order.indexOf(b.name)
      if (ia !== -1 && ib !== -1) return ia - ib
      if (ia !== -1) return -1
      if (ib !== -1) return 1
      return 0
    })
    return mapped
  } catch {
    return FALLBACK_DEPARTMENTS
  }
}

/** 医生列表 */
export const fetchDoctors = async (): Promise<DoctorItem[]> => {
  try {
    const res = await Network.request({ url: '/api/content/doctors' })
    if (!isApiOk(res)) return FALLBACK_DOCTORS
    const list = res.data?.data
    if (!Array.isArray(list) || list.length === 0) return FALLBACK_DOCTORS
    return list
      .filter((d: any) => d && d.name)
      .map((d: any) => ({
        id: d.id,
        name: d.name || '',
        title: d.title || '',
        avatar: d.avatar || '',
        specialty: d.specialty || '',
        introduction: d.introduction || '',
        departmentName: d.departmentName || '',
      }))
  } catch {
    return FALLBACK_DOCTORS
  }
}

/** 滚动内容列表（滚动新闻 / 健康知识） */
export const fetchRollingNews = async (): Promise<RollingNewsItem[]> => {
  try {
    const res = await Network.request({ url: '/api/content/rolling-news' })
    if (!isApiOk(res)) return FALLBACK_ROLLING
    const list = res.data?.data
    if (!Array.isArray(list)) return FALLBACK_ROLLING
    if (list.length === 0) return FALLBACK_ROLLING
    return list
      .filter((d: any) => d && d.content)
      .map((d: any) => ({
        id: d.id,
        content: d.content || '',
        sortOrder: Number(d.sortOrder) || 0,
        fontSize: String(d.fontSize || '14'),
        color: String(d.color || '#374151'),
      }))
  } catch {
    return FALLBACK_ROLLING
  }
}

/** 号源（静态环境回退默认号源） */
export const fetchQuota = async (params: {
  departmentId: string
  departmentName: string
  date: string
}): Promise<QuotaData> => {
  try {
    const res = await Network.request({ url: '/api/appointments/quota', data: params })
    if (!isApiOk(res)) return FALLBACK_QUOTA
    const d = res.data?.data
    if (!d || typeof d.morningQuota !== 'number') return FALLBACK_QUOTA
    return d as QuotaData
  } catch {
    return FALLBACK_QUOTA
  }
}
