import { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { User, Calendar, Clock, ChevronRight } from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { doctors, timeSlots, departments, getDateDisplay } from '@/data/mock-data'

const DoctorSelectPage = () => {
  const router = useRouter()
  const departmentId = router.params.departmentId || ''

  const deptDoctors = useMemo(
    () => doctors.filter((d) => d.departmentId === departmentId),
    [departmentId]
  )
  const dept = departments.find((d) => d.id === departmentId)

  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')

  // 获取选中医生的号源
  const doctorSlots = useMemo(() => {
    if (!selectedDoctor) return []
    return timeSlots.filter((s) => s.doctorId === selectedDoctor && s.remaining > 0)
  }, [selectedDoctor])

  // 按日期分组
  const slotsByDate = useMemo(() => {
    const grouped: Record<string, typeof doctorSlots> = {}
    doctorSlots.forEach((slot) => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = []
      }
      grouped[slot.date].push(slot)
    })
    return grouped
  }, [doctorSlots])

  const handleSubmit = () => {
    if (!selectedDoctor || !selectedSlot) {
      Taro.showToast({ title: '请选择医生和时段', icon: 'none' })
      return
    }
    Taro.navigateTo({
      url: `/pages/appointment/booking-form?doctorId=${selectedDoctor}&slotId=${selectedSlot}`,
    })
  }

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 科室信息 */}
      <View className="px-4 pt-4">
        <Card className="bg-teal-600 rounded-xl shadow-sm">
          <CardContent className="p-4">
            <Text className="text-lg font-bold text-white block">{dept?.name || '科室'}</Text>
            <Text className="text-sm text-teal-100 block mt-1">{dept?.location}</Text>
          </CardContent>
        </Card>
      </View>

      {/* 选择医生 */}
      <View className="px-4 mt-4">
        <View className="flex flex-row items-center gap-2 mb-3">
          <User size={18} color="#0D9488" />
          <Text className="text-lg font-bold text-slate-800 block">选择医生</Text>
        </View>

        <View className="flex flex-col gap-3">
          {deptDoctors.map((doc) => (
            <Card
              key={doc.id}
              className={`rounded-xl shadow-sm active:opacity-80 ${
                selectedDoctor === doc.id
                  ? 'bg-teal-50 border-teal-400 border-2'
                  : 'bg-white'
              }`}
              onClick={() => {
                setSelectedDoctor(doc.id)
                setSelectedSlot('')
              }}
            >
              <CardContent className="p-4">
                <View className="flex flex-row items-center gap-3">
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
                      <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-0 text-xs">
                        {doc.title}
                      </Badge>
                    </View>
                    <Text className="text-sm text-slate-500 block mt-1">
                      擅长：{doc.specialty}
                    </Text>
                  </View>
                  {selectedDoctor === doc.id && (
                    <View className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                      <Text className="text-white text-xs block">✓</Text>
                    </View>
                  )}
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>

      {/* 选择时段 */}
      {selectedDoctor && (
        <View className="px-4 mt-4 mb-6">
          <View className="flex flex-row items-center gap-2 mb-3">
            <Clock size={18} color="#0D9488" />
            <Text className="text-lg font-bold text-slate-800 block">选择时段</Text>
          </View>

          {Object.keys(slotsByDate).length === 0 ? (
            <Card className="bg-white rounded-xl shadow-sm">
              <CardContent className="p-6 flex items-center justify-center">
                <Text className="text-sm text-slate-400 block text-center">
                  暂无可用号源，请选择其他医生或日期
                </Text>
              </CardContent>
            </Card>
          ) : (
            <View className="flex flex-col gap-3">
              {Object.entries(slotsByDate).map(([date, slots]) => (
                <Card key={date} className="bg-white rounded-xl shadow-sm">
                  <CardContent className="p-4">
                    <View className="flex flex-row items-center gap-2 mb-3">
                      <Calendar size={14} color="#64748B" />
                      <Text className="text-sm font-semibold text-slate-700 block">
                        {getDateDisplay(date)}
                      </Text>
                    </View>
                    <View className="flex flex-row gap-3">
                      {slots.map((slot) => (
                        <View
                          key={slot.id}
                          className={`flex-1 rounded-lg p-3 text-center active:opacity-80 ${
                            selectedSlot === slot.id
                              ? 'bg-teal-600'
                              : 'bg-slate-50'
                          }`}
                          onClick={() => setSelectedSlot(slot.id)}
                        >
                          <Text
                            className={`text-sm font-semibold block ${
                              selectedSlot === slot.id ? 'text-white' : 'text-slate-700'
                            }`}
                          >
                            {slot.period === 'morning' ? '上午' : '下午'}
                          </Text>
                          <Text
                            className={`text-xs block mt-1 ${
                              selectedSlot === slot.id ? 'text-teal-100' : 'text-slate-500'
                            }`}
                          >
                            {slot.period === 'morning' ? '8:00-11:30' : '14:00-17:00'}
                          </Text>
                          <Text
                            className={`text-xs block mt-1 ${
                              selectedSlot === slot.id ? 'text-teal-100' : 'text-slate-400'
                            }`}
                          >
                            余{slot.remaining}号
                          </Text>
                        </View>
                      ))}
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          )}
        </View>
      )}

      {/* 底部提交按钮 */}
      {selectedDoctor && (
        <View className="px-4 pb-6">
          <Button
            className="w-full h-12 bg-teal-600 text-white text-lg font-semibold rounded-xl"
            onClick={handleSubmit}
            disabled={!selectedSlot}
          >
            <Text className="text-lg text-white font-semibold block">下一步：填写信息</Text>
            <ChevronRight size={18} color="#ffffff" />
          </Button>
        </View>
      )}
    </ScrollView>
  )
}

export default DoctorSelectPage
