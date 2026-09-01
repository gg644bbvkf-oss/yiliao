import { useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { CircleCheck, Calendar, Clock, MapPin, User, FileText } from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getAppointments, getDateDisplay } from '@/data/mock-data'

const BookingResultPage = () => {
  const router = useRouter()
  const appointmentNo = router.params.appointmentNo || ''

  const appointment = useMemo(() => {
    const list = getAppointments()
    return list.find((a) => a.appointmentNo === appointmentNo)
  }, [appointmentNo])

  const handleBackHome = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }

  const handleViewAppointments = () => {
    Taro.navigateTo({ url: '/pages/appointment/my-appointments' })
  }

  if (!appointment) {
    return (
      <View className="flex items-center justify-center h-full bg-teal-50">
        <Text className="text-slate-500 block">未找到预约信息</Text>
      </View>
    )
  }

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 成功图标 */}
      <View className="flex flex-col items-center pt-8 pb-4">
        <CircleCheck size={64} color="#0D9488" />
        <Text className="text-2xl font-bold text-teal-600 block mt-4">预约成功</Text>
        <Text className="text-sm text-slate-500 block mt-2">请按时前往就诊</Text>
      </View>

      {/* 预约凭证 */}
      <View className="px-4 mt-2 mb-6">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-4">
            <View className="flex flex-row items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <FileText size={18} color="#0D9488" />
              <Text className="text-base font-bold text-slate-800 block">预约凭证</Text>
            </View>

            <View className="flex flex-col gap-3">
              <View className="flex flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={16} color="#0D9488" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-slate-400 block">预约单号</Text>
                  <Text className="text-base font-bold text-orange-500 block mt-1">
                    {appointment.appointmentNo}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <User size={16} color="#0D9488" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-slate-400 block">就诊人</Text>
                  <Text className="text-base text-slate-800 block mt-1">
                    {appointment.patientName}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <Calendar size={16} color="#0D9488" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-slate-400 block">就诊时间</Text>
                  <Text className="text-base text-slate-800 block mt-1">
                    {getDateDisplay(appointment.date)}{' '}
                    {appointment.period === 'morning' ? '上午 8:00-11:30' : '下午 14:00-17:00'}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <Clock size={16} color="#0D9488" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-slate-400 block">科室 / 医生</Text>
                  <Text className="text-base text-slate-800 block mt-1">
                    {appointment.departmentName} - {appointment.doctorName}（
                    {appointment.doctorTitle}）
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} color="#0D9488" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-slate-400 block">就诊地点</Text>
                  <Text className="text-base text-slate-800 block mt-1">
                    {appointment.location}
                  </Text>
                </View>
              </View>
            </View>

            {/* 温馨提示 */}
            <View className="mt-4 pt-3 border-t border-slate-100">
              <Text className="text-xs text-slate-400 block leading-relaxed">
                温馨提示：请携带身份证和医保卡，提前15分钟到院取号。如需取消预约，请提前在「我的预约」中操作。
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 操作按钮 */}
      <View className="px-4 pb-6 flex flex-col gap-3">
        <Button
          className="w-full h-12 bg-teal-600 text-white text-lg font-semibold rounded-xl"
          onClick={handleViewAppointments}
        >
          <Text className="text-lg text-white font-semibold block">查看我的预约</Text>
        </Button>
        <Button
          className="w-full h-12 bg-white text-teal-600 border border-teal-200 text-lg font-semibold rounded-xl"
          onClick={handleBackHome}
        >
          <Text className="text-lg text-teal-600 font-semibold block">返回首页</Text>
        </Button>
      </View>
    </ScrollView>
  )
}

export default BookingResultPage
