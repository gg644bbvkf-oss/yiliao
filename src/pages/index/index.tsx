import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import {
  Building2,
  Users,
  HeartPulse,
  Phone,
  MapPin,
  ChevronRight,
  ArrowRight,
  Megaphone,
} from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import {
  fetchHospital,
  fetchRollingNews,
  FALLBACK_HOSPITAL,
  FALLBACK_ROLLING,
  type RollingNewsItem,
} from '@/services/content'
import { useState, useEffect } from 'react'
import './index.css'

const IndexPage = () => {
  const [hospital, setHospital] = useState(FALLBACK_HOSPITAL)
  const [rolling, setRolling] = useState<RollingNewsItem[]>(FALLBACK_ROLLING)
  const [activeRollIdx, setActiveRollIdx] = useState(0)

  useDidShow(() => {
    loadHospital()
    loadRolling()
  })

  // 公告纵向自动滚动：每隔一秒滚动到下一行（无内容则不滚动）
  useEffect(() => {
    if (rolling.length === 0) return
    setActiveRollIdx(0)
    const timer = setInterval(() => {
      setActiveRollIdx((prev) => (prev + 1) % rolling.length)
    }, 1000)
    return () => clearInterval(timer)
  }, [rolling.length])

  const loadHospital = async () => {
    const data = await fetchHospital()
    setHospital(data)
  }

  const loadRolling = async () => {
    const list = await fetchRollingNews()
    setRolling(list)
  }

  const handleGoAppointment = () => {
    Taro.switchTab({ url: '/pages/appointment/index' })
  }

  const handleGoDoctors = () => {
    Taro.switchTab({ url: '/pages/hospital/index' })
  }

  const handleCallPhone = () => {
    Taro.makePhoneCall({ phoneNumber: hospital.phone })
  }

  const handleOpenMap = () => {
    const name = '旬邑县城关镇卫生院'
    const addr = hospital.address || ''
    if (hospital.lng && hospital.lat) {
      const isMini =
        Taro.getEnv() === Taro.ENV_TYPE.WEAPP || Taro.getEnv() === Taro.ENV_TYPE.TT
      if (isMini) {
        // 小程序端直接调起内置地图导航
        Taro.openLocation({
          latitude: hospital.lat,
          longitude: hospital.lng,
          name,
          address: addr,
          scale: 16,
        }).catch(() => {
          Taro.showToast({ title: '暂无法打开地图', icon: 'none' })
        })
        return
      }
    }
    // H5 / Web 端：跳转高德地图搜索该地址
    const keyword = encodeURIComponent(addr + ' ' + name)
    const url = `https://uri.amap.com/search?keyword=${keyword}`
    const isWeb = [Taro.ENV_TYPE.WEB, Taro.ENV_TYPE.RN].includes(Taro.getEnv() as any)
    if (isWeb || (typeof window !== 'undefined' && typeof (window as any).open === 'function')) {
      ;(window as any).open(url, '_blank')
    } else {
      Taro.showToast({ title: '暂无法打开地图', icon: 'none' })
    }
  }

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 顶部医院名称（居中） */}
      <View className="bg-teal-600 px-4 pt-4 pb-3 flex flex-col items-center">
        <View className="flex flex-row items-center justify-center gap-2">
          {hospital.logo ? (
            <Image src={hospital.logo} className="w-9 h-9 rounded-full flex-shrink-0" mode="aspectFit" />
          ) : null}
          <Text className="block text-2xl font-bold text-white text-center">旬邑县城关镇卫生院</Text>
        </View>
        <Text className="block text-sm text-teal-100 mt-1 text-center">守护您和家人的健康</Text>
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

      {/* 预约挂号大按钮（照片下方·概况上方，加大 + 红色边框） */}
      <View className="px-4 mt-4">
        <View
          className="rounded-2xl px-6 py-5 flex flex-row items-center justify-between shadow-lg active:opacity-90"
          style={{ backgroundColor: '#F97316', border: '3px solid #EF4444', boxShadow: '0 4px 14px rgba(239,68,68,0.35)' }}
          onClick={handleGoAppointment}
        >
          <View className="flex-1">
            <Text className="block text-2xl font-extrabold text-white">在线预约挂号</Text>
            <Text className="block text-base text-orange-100 mt-2">全科 · 中医 · 住院，免排队，便捷就诊</Text>
          </View>
          <View className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 ml-3">
            <ArrowRight size={30} color="#EF4444" strokeWidth={2.5} />
          </View>
        </View>
      </View>

      {/* 滚动内容（医院新闻 / 健康知识）：纵向，自动换行，每隔一秒滚动一条 */}
      <View className="px-4 mt-4">
        <Card className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <CardContent className="px-6 py-5">
            <View className="flex flex-row items-center gap-2 mb-3">
              <Megaphone size={20} color="#0D9488" />
              <Text className="text-base font-bold text-slate-800 block">医院公告</Text>
            </View>
            <ScrollView
              scrollY
              scrollIntoView={`roll-${activeRollIdx}`}
              className="w-full h-20"
            >
              <View className="flex flex-col">
                {rolling.map((item, i) => (
                  <View
                    key={item.id}
                    id={`roll-${i}`}
                    className="flex flex-row items-center whitespace-pre-line h-20"
                  >
                    <View className="w-2 h-2 rounded-full bg-teal-500 mr-2 shrink-0" />
                    <View className="flex-1">
                      <Text className="block text-sm text-slate-600 leading-relaxed">
                        {item.content}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
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
              {hospital.intro
                .split(/\n+/)
                .filter((p) => p.trim())
                .map((p) => `　　${p}`)
                .join('\n')}
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

          <Card className="bg-white rounded-xl shadow-sm active:opacity-80" onClick={handleOpenMap}>
            <CardContent className="p-4 flex flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                <MapPin size={20} color="#0D9488" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-slate-800 block">医院地址（点击导航）</Text>
                <Text className="text-sm text-slate-500 block mt-1">{hospital.address}</Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
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