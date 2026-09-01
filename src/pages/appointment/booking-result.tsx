import { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { CircleCheck, Calendar, Clock, MapPin, User, FileText } from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Network } from '@/network'

interface Appointment {
  id: string
  patientName: string
  patientPhone: string
  departmentName: string
  doctorName: string
  doctorTitle: string
  date: string
  timeSlot: string
  status: string
  createdAt: string
}

const BookingResultPage = () => {
  const router = useRouter()
  const appointmentId = router.params.id || ''
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!appointmentId) {
      setLoading(false)
      return
    }
    Network.request({ url: '/api/appointments' })
      .then((res: any) => {
        console.log('获取预约列表:', res.data)
        const list = res.data?.data?.list || []
        const found = list.find((a: Appointment) => a.id === appointmentId)
        setAppointment(found || null)
      })
      .catch((err) => {
        console.error('获取预约信息失败:', err)
      })
      .finally(() => setLoading(false))
  }, [appointmentId])

  const handleBackHome = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }

  const handleViewAppointments = () => {
    Taro.navigateTo({ url: '/pages/appointment/my-appointments' })
  }

  if (loading) {
    return (
      <View className="flex items-center justify-center h-full bg-teal-50">
        <Text className="text-slate-500 block">加载中...</Text>
      </View>
    )
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
                <FileText size={16} color="#64748B" />
                <View className="flex-1">
                  <Text className="text-xs text-slate-400 block">预约单号</Text>
                  <Text className="text-sm font-semibold text-slate-800 block">
                    {appointment.id}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <User size={16} color="#64748B" />
                <View className="flex-1">
                  <Text className="text-xs text-slate-400 block">就诊人</Text>
                  <Text className="text-sm font-semibold text-slate-800 block">
                    {appointment.patientName}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <Calendar size={16} color="#64748B" />
                <View className="flex-1">
                  <Text className="text-xs text-slate-400 block">就诊日期</Text>
                  <Text className="text-sm font-semibold text-slate-800 block">
                    {appointment.date}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <Clock size={16} color="#64748B" />
                <View className="flex-1">
                  <Text className="text-xs text-slate-400 block">就诊时段</Text>
                  <Text className="text-sm font-semibold text-slate-800 block">
                    {appointment.timeSlot}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <User size={16} color="#64748B" />
                <View className="flex-1">
                  <Text className="text-xs text-slate-400 block">就诊科室</Text>
                  <Text className="text-sm font-semibold text-slate-800 block">
                    {appointment.departmentName}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <User size={16} color="#64748B" />
                <View className="flex-1">
                  <Text className="text-xs text-slate-400 block">接诊医生</Text>
                  <Text className="text-sm font-semibold text-slate-800 block">
                    {appointment.doctorName} {appointment.doctorTitle}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <MapPin size={16} color="#64748B" />
                <View className="flex-1">
                  <Text className="text-xs text-slate-400 block">就诊地点</Text>
                  <Text className="text-sm font-semibold text-slate-800 block">
                    旬邑县城关镇卫生院 {appointment.departmentName}
                  </Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 温馨提示 */}
      <View className="px-4 mb-6">
        <Card className="bg-amber-50 rounded-xl border border-amber-200">
          <CardContent className="p-4">
            <Text className="text-sm font-semibold text-amber-800 block mb-2">温馨提示</Text>
            <Text className="text-xs text-amber-700 block">
              1. 请携带身份证原件按时就诊{'\n'}
              2. 如需取消预约，请提前在「我的预约」中操作{'\n'}
              3. 就诊前请准备好医保卡
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* 操作按钮 */}
      <View className="px-4 pb-8 flex flex-col gap-3">
        <Button
          className="w-full h-12 bg-teal-600 text-white text-base font-semibold rounded-xl"
          onClick={handleViewAppointments}
        >
          <Text className="text-base text-white font-semibold block">查看我的预约</Text>
        </Button>
        <Button
          className="w-full h-12 bg-white text-teal-600 text-base font-semibold rounded-xl border border-teal-200"
          onClick={handleBackHome}
        >
          <Text className="text-base text-teal-600 font-semibold block">返回首页</Text>
        </Button>
      </View>
    </ScrollView>
  )
}

export default BookingResultPage
