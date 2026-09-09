import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import {
  Building2,
  Users,
  Award,
  HeartPulse,
  Phone,
  MapPin,
  ChevronRight,
  ArrowRight,
} from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Network } from '@/network'
import { useState } from 'react'
import './index.css'

interface HospitalData {
  intro: string
  service: string
  image: string
  stats: Array<{ label: string; value: string }>
  phone: string
  address: string
}

const IndexPage = () => {
  const [hospital, setHospital] = useState<HospitalData>({
    intro: '',
    service: '',
    image: '',
    stats: [
      { label: '建筑面积', value: '2185㎡' },
      { label: '职工人数', value: '18人' },
      { label: '中高级职称', value: '14人' },
      { label: '开设床位', value: '18张' },
    ],
    phone: '0910-3456789',
    address: '旬邑县阳光大道幽风庭韵小区西侧',
  })

  useDidShow(() => {
    loadHospital()
  })

  const loadHospital = async () => {
    try {
      const res = await Network.request({ url: '/api/content/hospital' })
      const data = res.data?.data || {}
      let stats = hospital.stats
      try {
        const parsed = JSON.parse(data.stats || '[]')
        if (Array.isArray(parsed) && parsed.length) stats = parsed
      } catch {
        /* ignore */
      }
      setHospital({
        intro: data.intro || hospital.intro,
        service: data.service || hospital.service,
        image: data.image || '',
        stats,
        phone: data.phone || hospital.phone,
        address: data.address || hospital.address,
      })
    } catch {
      /* 保持默认 */
    }
  }

  const statsIcons = [Building2, Users, Award, HeartPulse]

  const handleGoAppointment = () => {
    Taro.switchTab({ url: '/pages/appointment/index' })
  }

  const handleGoDoctors = () => {
    Taro.switchTab({ url: '/pages/hospital/index' })
  }

  const handleCallPhone = () => {
    Taro.makePhoneCall({ phoneNumber: hospital.phone })
  }

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 顶部医院名称（居中） */}
      <View className="bg-teal-600 px-4 pt-4 pb-3 flex flex-col items-center">
        <Text className="block text-2xl font-bold text-white text-center">旬邑县城关镇卫生院</Text>
        <Text className="block text-sm text-teal-100 mt-1 text-center">守护您和家人的健康</Text>
      </View>

      {/* 预约挂号大按钮（置顶突出，橙色底 + 红色箭头） */}
      <View className="px-4 -mt-2">
        <View
          className="rounded-2xl px-5 py-4 flex flex-row items-center justify-between shadow-md mt-3 active:opacity-90"
          style={{ backgroundColor: '#F97316' }}
          onClick={handleGoAppointment}
        >
          <View>
            <Text className="block text-xl font-bold text-white">在线预约挂号</Text>
            <Text className="block text-sm text-orange-100 mt-1">全科 · 中医 · 住院，免排队，便捷就诊</Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <ArrowRight size={26} color="#EF4444" strokeWidth={2.5} />
          </View>
        </View>
      </View>

      {/* 医院图片 */}
      <View className="px-4 mt-4">
        <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
          {hospital.image ? (
            <Image className="w-full h-48" src={hospital.image} mode="aspectFill" />
          ) : (
            <View className="w-full h-48 bg-gradient-to-r from-teal-500 to-emerald-400 flex items-center justify-center">
              <Text className="block text-lg text-white font-semibold">旬邑县城关镇卫生院</Text>
            </View>
          )}
        </Card>
      </View>

      {/* 数据统计 */}
      <View className="px-4 mt-4">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-4 flex flex-row">
            {hospital.stats.slice(0, 4).map((stat, idx) => {
              const IconComp = statsIcons[idx] || HeartPulse
              return (
                <View key={stat.label} className="flex-1 flex flex-col items-center gap-1">
                  <IconComp size={20} color="#0D9488" />
                  <Text className="text-lg font-bold text-teal-600 block">{stat.value}</Text>
                  <Text className="text-xs text-slate-500 block">{stat.label}</Text>
                </View>
              )
            })}
          </CardContent>
        </Card>
      </View>

      {/* 医院概况 */}
      <View className="px-4 mt-4">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-4">
            <View className="flex flex-row items-center gap-2 mb-3">
              <Building2 size={18} color="#0D9488" />
              <Text className="text-lg font-bold text-slate-800 block">医院概况</Text>
            </View>
            <Text className="text-base text-slate-700 block leading-relaxed whitespace-pre-line">
              {hospital.intro}
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* 服务范围 */}
      <View className="px-4 mt-4">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-4">
            <View className="flex flex-row items-center gap-2 mb-3">
              <HeartPulse size={18} color="#0D9488" />
              <Text className="text-lg font-bold text-slate-800 block">服务范围</Text>
            </View>
            <Text className="text-base text-slate-700 block leading-relaxed">{hospital.service}</Text>
          </CardContent>
        </Card>
      </View>

      {/* 快捷信息 */}
      <View className="px-4 mt-4">
        <View className="flex flex-col gap-3">
          <Card className="bg-white rounded-xl shadow-sm active:opacity-80" onClick={handleGoDoctors}>
            <CardContent className="p-4 flex flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                <Users size={20} color="#0D9488" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-slate-800 block">医生团队</Text>
                <Text className="text-sm text-slate-500 block mt-1">查看医生介绍与擅长</Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm active:opacity-80" onClick={handleCallPhone}>
            <CardContent className="p-4 flex flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                <Phone size={20} color="#0D9488" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-slate-800 block">咨询电话</Text>
                <Text className="text-sm text-slate-500 block mt-1">{hospital.phone}</Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-4 flex flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                <MapPin size={20} color="#0D9488" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-slate-800 block">医院地址</Text>
                <Text className="text-sm text-slate-500 block mt-1">{hospital.address}</Text>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>

      {/* 底部间距 */}
      <View className="h-6" />
    </ScrollView>
  )
}

export default IndexPage