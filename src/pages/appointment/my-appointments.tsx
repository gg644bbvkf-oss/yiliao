import { useState, useCallback, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Calendar, Clock, MapPin, User } from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

const statusMap: Record<string, { label: string; className: string }> = {
  confirmed: { label: '已预约', className: 'bg-teal-50 text-teal-700 border-0' },
  cancelled: { label: '已取消', className: 'bg-red-50 text-red-500 border-0' },
}

const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = useCallback(() => {
    setLoading(true)
    Network.request({ url: '/api/appointments' })
      .then((res: any) => {
        console.log('获取预约列表:', res.data)
        setAppointments(res.data?.data?.list || [])
      })
      .catch((err) => {
        console.error('获取预约列表失败:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const handleCancel = useCallback(
    (aptId: string) => {
      Taro.showModal({
        title: '取消预约',
        content: '确定要取消这个预约吗？',
        confirmText: '确定取消',
        cancelText: '再想想',
        confirmColor: '#EF4444',
        success: (res) => {
          if (res.confirm) {
            Network.request({
              url: '/api/appointments/cancel',
              method: 'POST',
              data: { id: aptId },
            })
              .then((cancelRes: any) => {
                console.log('取消预约响应:', cancelRes.data)
                if (cancelRes.data?.code === 200) {
                  fetchAppointments()
                  Taro.showToast({ title: '已取消预约', icon: 'success' })
                }
              })
              .catch((err) => {
                console.error('取消预约失败:', err)
                Taro.showToast({ title: '取消失败', icon: 'none' })
              })
          }
        },
      })
    },
    [fetchAppointments],
  )

  if (loading) {
    return (
      <View className="flex items-center justify-center h-full bg-teal-50">
        <Text className="text-slate-500 block">加载中...</Text>
      </View>
    )
  }

  if (appointments.length === 0) {
    return (
      <View className="flex flex-col items-center justify-center h-full bg-teal-50 px-8">
        <Calendar size={48} color="#CBD5E1" />
        <Text className="text-base text-slate-400 block mt-4 text-center">
          暂无预约记录
        </Text>
        <Button
          className="mt-6 bg-teal-600 text-white rounded-xl h-11 px-8"
          onClick={() => Taro.switchTab({ url: '/pages/appointment/index' })}
        >
          <Text className="text-base text-white block">去预约挂号</Text>
        </Button>
      </View>
    )
  }

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      <View className="px-4 pt-4 pb-6">
        <View className="flex flex-col gap-3">
          {appointments.map((apt) => {
            const status = statusMap[apt.status] || statusMap.confirmed
            return (
              <Card key={apt.id} className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <View className="flex flex-row items-center justify-between mb-3">
                    <Badge
                      variant="secondary"
                      className={status.className + ' text-xs'}
                    >
                      {status.label}
                    </Badge>
                    <Text className="text-xs text-slate-400 block">
                      {apt.id}
                    </Text>
                  </View>

                  <View className="flex flex-row items-center gap-2 mb-2">
                    <User size={14} color="#0D9488" />
                    <Text className="text-base font-semibold text-slate-800 block">
                      {apt.patientName}
                    </Text>
                  </View>

                  <View className="flex flex-row items-center gap-2 mb-2">
                    <Calendar size={14} color="#64748B" />
                    <Text className="text-sm text-slate-600 block">
                      {apt.date}
                    </Text>
                    <Clock size={14} color="#64748B" className="ml-2" />
                    <Text className="text-sm text-slate-600 block">
                      {apt.timeSlot}
                    </Text>
                  </View>

                  <View className="flex flex-row items-center gap-2 mb-2">
                    <User size={14} color="#64748B" />
                    <Text className="text-sm text-slate-600 block">
                      {apt.departmentName} · {apt.doctorName} {apt.doctorTitle}
                    </Text>
                  </View>

                  <View className="flex flex-row items-center gap-2">
                    <MapPin size={14} color="#64748B" />
                    <Text className="text-sm text-slate-500 block">
                      旬邑县城关镇卫生院
                    </Text>
                  </View>

                  {apt.status !== 'cancelled' && (
                    <View className="mt-3 pt-3 border-t border-slate-100">
                      <Button
                        variant="outline"
                        className="w-full h-10 text-sm text-red-500 border-red-200 rounded-lg"
                        onClick={() => handleCancel(apt.id)}
                      >
                        <Text className="text-sm text-red-500 block">取消预约</Text>
                      </Button>
                    </View>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </View>
      </View>
    </ScrollView>
  )
}

export default MyAppointmentsPage
