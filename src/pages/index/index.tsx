import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  Building2,
  Users,
  Award,
  HeartPulse,
  Clock,
  Phone,
  MapPin,
  ChevronRight,
} from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { hospitalInfo } from '@/data/mock-data'
import './index.css'

const stats = [
  { label: '建院年份', value: '1958年', icon: Building2 },
  { label: '职工人数', value: '56人', icon: Users },
  { label: '高级职称', value: '5人', icon: Award },
  { label: '年门诊量', value: '8万人次', icon: HeartPulse },
]

const IndexPage = () => {
  const handleGoAppointment = () => {
    Taro.switchTab({ url: '/pages/appointment/index' })
  }

  const handleGoDoctors = () => {
    Taro.switchTab({ url: '/pages/hospital/index' })
  }

  const handleCallPhone = () => {
    Taro.makePhoneCall({ phoneNumber: hospitalInfo.phone })
  }

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 顶部医院名称 */}
      <View className="bg-teal-600 px-4 pt-4 pb-6">
        <Text className="block text-2xl font-bold text-white">{hospitalInfo.name}</Text>
        <Text className="block text-sm text-teal-100 mt-1">守护您和家人的健康</Text>
      </View>

      {/* 医院图片 */}
      <View className="px-4 -mt-3">
        <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Image
            className="w-full h-48"
            src={hospitalInfo.image}
            mode="aspectFill"
          />
        </Card>
      </View>

      {/* 数据统计 */}
      <View className="px-4 mt-4">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-4 flex flex-row">
            {stats.map((stat) => {
              const IconComp = stat.icon
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

      {/* 医院简介 */}
      <View className="px-4 mt-4">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-4">
            <View className="flex flex-row items-center gap-2 mb-3">
              <Building2 size={18} color="#0D9488" />
              <Text className="text-lg font-bold text-slate-800 block">医院概况</Text>
            </View>
            <Text className="text-base text-slate-700 block leading-relaxed whitespace-pre-line">
              {hospitalInfo.summary}
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
            <Text className="text-base text-slate-700 block leading-relaxed">
              {hospitalInfo.serviceScope}
            </Text>
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
                <Text className="text-sm text-slate-500 block mt-1">查看科室与医生介绍</Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm active:opacity-80" onClick={handleGoAppointment}>
            <CardContent className="p-4 flex flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Clock size={20} color="#F97316" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-slate-800 block">预约挂号</Text>
                <Text className="text-sm text-slate-500 block mt-1">在线预约，便捷就诊</Text>
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
                <Text className="text-sm text-slate-500 block mt-1">{hospitalInfo.phone}</Text>
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
                <Text className="text-sm text-slate-500 block mt-1">{hospitalInfo.address}</Text>
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
