import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { ChevronRight } from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { doctors } from '@/data/mock-data'

const HospitalPage = () => {
  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 顶部标题 */}
      <View className="bg-teal-600 px-4 pt-4 pb-6">
        <Text className="text-xl font-bold text-white block">医生团队</Text>
        <Text className="text-sm text-teal-100 block mt-1">专业可靠，用心服务</Text>
      </View>

      {/* 医生列表 */}
      <View className="px-4 -mt-3 pb-6">
        <View className="flex flex-col gap-3">
          {doctors.map((doc) => (
            <Card
              key={doc.id}
              className="bg-white rounded-xl shadow-sm active:opacity-80"
              onClick={() =>
                Taro.navigateTo({
                  url: `/pages/hospital/doctor-detail?id=${doc.id}`,
                })
              }
            >
              <CardContent className="p-4 flex flex-row items-center gap-3">
                <Image
                  src={doc.avatar}
                  className="w-12 h-12 rounded-full flex-shrink-0"
                  mode="aspectFill"
                />
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
                  <Text className="text-sm text-slate-500 block mt-1">
                    {doc.departmentName}
                  </Text>
                  <Text className="text-sm text-slate-500 block mt-1">
                    擅长：{doc.specialty}
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </CardContent>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default HospitalPage
