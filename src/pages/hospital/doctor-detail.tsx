import { useMemo } from 'react'
import SupportFooter from '@/components/support-footer'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { doctors } from '@/data/mock-data'

const DoctorDetailPage = () => {
  const router = useRouter()
  const doctorId = router.params.id || ''

  const doctor = useMemo(() => doctors.find((d) => d.id === doctorId), [doctorId])

  const handleBook = () => {
    if (doctor) {
      Taro.navigateTo({
        url: `/pages/appointment/doctor-select?departmentId=${doctor.departmentId}`,
      })
    }
  }

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 医生基本信息 */}
      <View className="px-4 pt-4">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-4 flex flex-row items-center gap-4">
            <Image
              src={doctor?.avatar || ''}
              className="w-16 h-16 rounded-full flex-shrink-0"
              mode="aspectFill"
            />
            <View className="flex-1">
              <Text className="text-xl font-bold text-slate-800 block">
                {doctor?.name}
              </Text>
              <View className="flex flex-row items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="bg-teal-50 text-teal-700 border-0 text-xs"
                >
                  {doctor?.title}
                </Badge>
                <Text className="text-sm text-slate-500 block">
                  {doctor?.departmentName}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 擅长方向 */}
      <View className="px-4 mt-4">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-4">
            <Text className="text-base font-semibold text-slate-800 block mb-2">
              擅长方向
            </Text>
            <Text className="text-base text-slate-700 block leading-relaxed">
              {doctor?.specialty}
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* 个人简介 */}
      <View className="px-4 mt-4 mb-6">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-4">
            <Text className="text-base font-semibold text-slate-800 block mb-2">
              个人简介
            </Text>
            <Text className="text-base text-slate-700 block leading-relaxed">
              {doctor?.introduction}
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* 预约按钮 */}
      <View className="px-4 pb-6">
        <Button
          className="w-full h-12 bg-teal-600 text-white text-lg font-semibold rounded-xl"
          onClick={handleBook}
        >
          <Text className="text-lg text-white font-semibold block">在线预约</Text>
        </Button>
      </View>
      <SupportFooter />
    </ScrollView>
  )
}

export default DoctorDetailPage
