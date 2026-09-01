import { useState, useCallback } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Calendar, Clock, MapPin, User, CircleAlert } from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  getAppointments,
  cancelAppointment,
  getDateDisplay,
  type Appointment,
} from '@/data/mock-data'

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: '待就诊', className: 'bg-teal-50 text-teal-700 border-0' },
  completed: { label: '已完成', className: 'bg-slate-100 text-slate-600 border-0' },
  cancelled: { label: '已取消', className: 'bg-red-50 text-red-500 border-0' },
}

const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => getAppointments())

  const handleCancel = useCallback((aptId: string) => {
    Taro.showModal({
      title: '取消预约',
      content: '确定要取消这个预约吗？取消后号源将被释放。',
      confirmText: '确定取消',
      cancelText: '再想想',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          cancelAppointment(aptId)
          setAppointments(getAppointments())
          Taro.showToast({ title: '已取消预约', icon: 'success' })
        }
      },
    })
  }, [])

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
            const statusInfo = statusMap[apt.status] || statusMap.pending
            return (
              <Card key={apt.id} className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-4">
                  {/* 状态和单号 */}
                  <View className="flex flex-row items-center justify-between mb-3">
                    <Text className="text-sm text-slate-400 block">
                      单号：{apt.appointmentNo}
                    </Text>
                    <Badge variant="secondary" className={statusInfo.className}>
                      {statusInfo.label}
                    </Badge>
                  </View>

                  {/* 科室医生 */}
                  <View className="flex flex-row items-center gap-2 mb-2">
                    <View className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <User size={14} color="#0D9488" />
                    </View>
                    <Text className="text-base font-semibold text-slate-800 block">
                      {apt.departmentName} - {apt.doctorName}（{apt.doctorTitle}）
                    </Text>
                  </View>

                  {/* 时间地点 */}
                  <View className="flex flex-col gap-2 ml-10">
                    <View className="flex flex-row items-center gap-2">
                      <Calendar size={13} color="#94A3B8" />
                      <Text className="text-sm text-slate-600 block">
                        {getDateDisplay(apt.date)}
                      </Text>
                      <Clock size={13} color="#94A3B8" />
                      <Text className="text-sm text-slate-600 block">
                        {apt.period === 'morning' ? '上午' : '下午'}
                      </Text>
                    </View>
                    <View className="flex flex-row items-center gap-2">
                      <MapPin size={13} color="#94A3B8" />
                      <Text className="text-sm text-slate-500 block">{apt.location}</Text>
                    </View>
                  </View>

                  {/* 就诊人 */}
                  <View className="mt-3 pt-3 border-t border-slate-100">
                    <Text className="text-sm text-slate-500 block">
                      就诊人：{apt.patientName} {apt.patientPhone}
                    </Text>
                  </View>

                  {/* 取消按钮 */}
                  {apt.status === 'pending' && (
                    <View className="mt-3 flex flex-row justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-500 rounded-lg"
                        onClick={() => handleCancel(apt.id)}
                      >
                        <CircleAlert size={14} color="#EF4444" />
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
