import { useState } from 'react'
import { View, Text, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  CalendarPlus,
  Hospital,
  Stethoscope,
  BookOpen,
  Phone,
  Megaphone,
  ChevronRight,
  Clock,
} from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { announcements, healthArticles } from '@/data/mock-data'
import './index.css'

const quickEntries = [
  { name: '预约挂号', icon: CalendarPlus, color: '#0D9488', page: '/pages/appointment/index' },
  { name: '医院介绍', icon: Hospital, color: '#0EA5E9', page: '/pages/hospital/index' },
  { name: '科室医生', icon: Stethoscope, color: '#8B5CF6', page: '/pages/hospital/index' },
  { name: '就诊指南', icon: BookOpen, color: '#F97316', page: '/pages/hospital/index' },
  { name: '联系我们', icon: Phone, color: '#EF4444', page: '/pages/hospital/index' },
]

const IndexPage = () => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0)

  const handleQuickEntry = (page: string) => {
    if (page === '/pages/appointment/index' || page === '/pages/hospital/index') {
      Taro.switchTab({ url: page })
    } else {
      Taro.navigateTo({ url: page })
    }
  }

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 顶部医院名称区域 */}
      <View className="bg-teal-600 px-4 pt-4 pb-6">
        <Text className="block text-2xl font-bold text-white">XX镇卫生院</Text>
        <Text className="block text-sm text-teal-100 mt-1">守护您和家人的健康</Text>
      </View>

      {/* 公告轮播 */}
      <View className="px-4 -mt-3">
        <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
          <CardContent className="p-3 flex flex-row items-center gap-3">
            <View className="flex-shrink-0">
              <Megaphone size={20} color="#F97316" />
            </View>
            <View className="flex-1 overflow-hidden">
              <Swiper
                className="h-10"
                vertical
                circular
                autoplay
                interval={4000}
                duration={500}
                onChange={(e) => setCurrentAnnouncement(e.detail.current)}
              >
                {announcements.map((item) => (
                  <SwiperItem key={item.id}>
                    <View className="flex items-center h-10">
                      <Text className="text-sm text-slate-800 truncate flex-1 block">
                        {item.title}
                      </Text>
                    </View>
                  </SwiperItem>
                ))}
              </Swiper>
            </View>
            <View className="flex-shrink-0">
              <Text className="text-xs text-slate-400">
                {currentAnnouncement + 1}/{announcements.length}
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 快捷入口 */}
      <View className="px-4 mt-4">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-4">
            <View className="flex flex-row justify-between">
              {quickEntries.map((entry) => {
                const IconComp = entry.icon
                return (
                  <View
                    key={entry.name}
                    className="flex flex-col items-center gap-2"
                    onClick={() => handleQuickEntry(entry.page)}
                  >
                    <View
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${entry.color}15` }}
                    >
                      <IconComp size={24} color={entry.color} />
                    </View>
                    <Text className="text-xs text-slate-700 block">{entry.name}</Text>
                  </View>
                )
              })}
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 健康宣教资讯 */}
      <View className="px-4 mt-4 mb-6">
        <View className="flex flex-row items-center justify-between mb-3">
          <Text className="text-lg font-bold text-slate-800 block">健康宣教</Text>
          <View className="flex flex-row items-center gap-1">
            <Text className="text-sm text-teal-600 block">更多</Text>
            <ChevronRight size={14} color="#0D9488" />
          </View>
        </View>

        <View className="flex flex-col gap-3">
          {healthArticles.map((article) => (
            <Card key={article.id} className="bg-white rounded-xl shadow-sm">
              <CardContent className="p-4">
                <View className="flex flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-slate-800 block mb-2">
                      {article.title}
                    </Text>
                    <Text className="text-sm text-slate-500 block leading-relaxed">
                      {article.summary}
                    </Text>
                    <View className="flex flex-row items-center gap-2 mt-3">
                      <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-0 text-xs">
                        {article.category}
                      </Badge>
                      <View className="flex flex-row items-center gap-1">
                        <Clock size={12} color="#94A3B8" />
                        <Text className="text-xs text-slate-400 block">{article.date}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default IndexPage
