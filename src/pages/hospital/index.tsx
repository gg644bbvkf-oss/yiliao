import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fetchDoctors, FALLBACK_DOCTORS, type DoctorItem } from '@/services/content'
import { useState } from 'react'

const HospitalPage = () => {
  const [doctors, setDoctors] = useState<DoctorItem[]>(FALLBACK_DOCTORS)

  useDidShow(() => {
    loadDoctors()
  })

  const loadDoctors = async () => {
    const list = await fetchDoctors()
    setDoctors(list)
  }

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 顶部标题 */}
      <View className="bg-teal-600 px-4 pt-4 pb-6">
        <Text className="text-xl font-bold text-white block">医生介绍</Text>
        <Text className="text-sm text-teal-100 block mt-1">专业可靠，用心服务</Text>
      </View>

      {/* 医生列表（照片 + 简介） */}
      <View className="px-4 -mt-3 pb-6">
        {doctors.length === 0 ? (
          <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
              <Text className="block text-center text-slate-500">
                暂无医生信息，请到管理后台添加
              </Text>
            </CardContent>
          </Card>
        ) : (
          <View className="flex flex-col gap-3">
            {doctors.map((doc) => (
              <Card key={doc.id} className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-4 flex flex-row items-center gap-4">
                  {doc.avatar ? (
                    <Image
                      src={doc.avatar}
                      className="w-20 h-28 rounded-lg flex-shrink-0"
                      mode="aspectFill"
                    />
                  ) : (
                    <View className="w-20 h-28 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <Text className="text-2xl font-bold text-teal-700 block">
                        {doc.name.charAt(0)}
                      </Text>
                    </View>
                  )}
                  <View className="flex-1">
                    <View className="flex flex-row items-center gap-2">
                      <Text className="text-base font-semibold text-slate-800 block">
                        {doc.name}
                      </Text>
                      <Badge
                        variant="secondary"
                        className="bg-teal-50 text-teal-700 border-0 text-xs"
                      >
                        {doc.title}
                      </Badge>
                    </View>
                    <Text className="text-sm text-slate-500 block mt-1 leading-relaxed">
                      {doc.introduction || doc.specialty}
                    </Text>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default HospitalPage