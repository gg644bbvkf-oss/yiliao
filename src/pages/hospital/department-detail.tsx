import { useMemo } from 'react'
import SupportFooter from '@/components/support-footer'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { ChevronRight } from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { departments, doctors } from '@/data/mock-data'

const DepartmentDetailPage = () => {
  const router = useRouter()
  const deptId = router.params.id || ''

  const dept = useMemo(() => departments.find((d) => d.id === deptId), [deptId])
  const deptDoctors = useMemo(() => doctors.filter((d) => d.departmentId === deptId), [deptId])

  const handleBook = () => {
    Taro.navigateTo({ url: `/pages/appointment/doctor-select?departmentId=${deptId}` })
  }

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 科室信息 */}
      <View className="px-4 pt-4">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-4">
            <Text className="text-xl font-bold text-slate-800 block">{dept?.name}</Text>
            <Text className="text-sm text-slate-500 block mt-1">位置：{dept?.location}</Text>
            <View className="mt-3 pt-3 border-t border-slate-100">
              <Text className="text-base text-slate-700 block leading-relaxed">
                {dept?.description}
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 科室医生 */}
      <View className="px-4 mt-4 mb-4">
        <Text className="text-lg font-bold text-slate-800 block mb-3">科室医生</Text>
        <View className="flex flex-col gap-3">
          {deptDoctors.map((doc) => (
            <Card
              key={doc.id}
              className="bg-white rounded-xl shadow-sm active:opacity-80"
              onClick={() =>
                Taro.navigateTo({ url: `/pages/hospital/doctor-detail?id=${doc.id}` })
              }
            >
              <CardContent className="p-4 flex flex-row items-center gap-3">
                <View className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Text className="text-lg font-bold text-teal-700 block">
                    {doc.name.charAt(0)}
                  </Text>
                </View>
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
                    擅长：{doc.specialty}
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </CardContent>
            </Card>
          ))}
        </View>
      </View>

      {/* 预约挂号按钮 */}
      <View className="px-4 pb-6">
        <Button
          className="w-full h-12 bg-teal-600 text-white text-lg font-semibold rounded-xl"
          onClick={handleBook}
        >
          <Text className="text-lg text-white font-semibold block">预约本科室</Text>
        </Button>
      </View>
      <SupportFooter />
    </ScrollView>
  )
}

export default DepartmentDetailPage
