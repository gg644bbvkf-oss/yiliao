import { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { User, Phone, CreditCard } from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  doctors,
  timeSlots,
  departments,
  getPatients,
  saveAppointment,
  generateAppointmentNo,
  getDateDisplay,
  type Patient,
} from '@/data/mock-data'

const BookingFormPage = () => {
  const router = useRouter()
  const doctorId = router.params.doctorId || ''
  const slotId = router.params.slotId || ''

  const doctor = useMemo(() => doctors.find((d) => d.id === doctorId), [doctorId])
  const slot = useMemo(() => timeSlots.find((s) => s.id === slotId), [slotId])
  const dept = useMemo(
    () => departments.find((d) => d.id === doctor?.departmentId),
    [doctor]
  )
  const savedPatients = useMemo(() => getPatients(), [])

  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [patientIdCard, setPatientIdCard] = useState('')
  const [selectedPatientIdx, setSelectedPatientIdx] = useState(-1)

  const handleSelectPatient = (idx: number) => {
    const p = savedPatients[idx]
    setSelectedPatientIdx(idx)
    setPatientName(p.name)
    setPatientPhone(p.phone)
    setPatientIdCard(p.idCard)
  }

  const handleSubmit = () => {
    if (!patientName.trim()) {
      Taro.showToast({ title: '请输入就诊人姓名', icon: 'none' })
      return
    }
    if (!/^1\d{10}$/.test(patientPhone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (!/^\d{17}[\dXx]$/.test(patientIdCard)) {
      Taro.showToast({ title: '请输入正确的身份证号', icon: 'none' })
      return
    }

    const appointmentNo = generateAppointmentNo()
    saveAppointment({
      id: `apt-${Date.now()}`,
      appointmentNo,
      patientName: patientName.trim(),
      patientPhone,
      patientIdCard,
      departmentId: doctor?.departmentId || '',
      departmentName: dept?.name || '',
      doctorId: doctor?.id || '',
      doctorName: doctor?.name || '',
      doctorTitle: doctor?.title || '',
      date: slot?.date || '',
      period: slot?.period || 'morning',
      status: 'pending',
      createTime: new Date().toISOString(),
      location: dept?.location || '',
    })

    // 保存就诊人
    if (selectedPatientIdx < 0) {
      const newPatient: Patient = {
        id: `p-${Date.now()}`,
        name: patientName.trim(),
        phone: patientPhone,
        idCard: patientIdCard,
        relation: '本人',
        isDefault: savedPatients.length === 0,
      }
      const list = getPatients()
      list.push(newPatient)
      Taro.setStorageSync('patients', list)
    }

    Taro.redirectTo({
      url: `/pages/appointment/booking-result?appointmentNo=${appointmentNo}`,
    })
  }

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 预约信息摘要 */}
      <View className="px-4 pt-4">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-4">
            <Text className="text-base font-bold text-slate-800 block mb-3">预约信息</Text>
            <View className="flex flex-col gap-2">
              <View className="flex flex-row justify-between">
                <Text className="text-sm text-slate-500 block">科室</Text>
                <Text className="text-sm text-slate-800 block">{dept?.name}</Text>
              </View>
              <View className="flex flex-row justify-between">
                <Text className="text-sm text-slate-500 block">医生</Text>
                <Text className="text-sm text-slate-800 block">
                  {doctor?.name}（{doctor?.title}）
                </Text>
              </View>
              <View className="flex flex-row justify-between">
                <Text className="text-sm text-slate-500 block">日期</Text>
                <Text className="text-sm text-slate-800 block">
                  {slot ? getDateDisplay(slot.date) : ''}
                </Text>
              </View>
              <View className="flex flex-row justify-between">
                <Text className="text-sm text-slate-500 block">时段</Text>
                <Text className="text-sm text-slate-800 block">
                  {slot?.period === 'morning' ? '上午 8:00-11:30' : '下午 14:00-17:00'}
                </Text>
              </View>
              <View className="flex flex-row justify-between">
                <Text className="text-sm text-slate-500 block">地点</Text>
                <Text className="text-sm text-slate-800 block">{dept?.location}</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 快速选择就诊人 */}
      {savedPatients.length > 0 && (
        <View className="px-4 mt-4">
          <Text className="text-sm text-slate-600 block mb-2">快速选择就诊人</Text>
          <View className="flex flex-row gap-2 flex-wrap">
            {savedPatients.map((p, idx) => (
              <View
                key={p.id}
                className={`px-4 py-2 rounded-full active:opacity-80 ${
                  selectedPatientIdx === idx
                    ? 'bg-teal-600'
                    : 'bg-white border border-slate-200'
                }`}
                onClick={() => handleSelectPatient(idx)}
              >
                <Text
                  className={`text-sm block ${
                    selectedPatientIdx === idx ? 'text-white' : 'text-slate-700'
                  }`}
                >
                  {p.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 就诊人信息表单 */}
      <View className="px-4 mt-4 mb-6">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-4">
            <Text className="text-base font-bold text-slate-800 block mb-4">就诊人信息</Text>

            <View className="flex flex-col gap-4">
              <View>
                <Label className="text-sm text-slate-600 mb-2 block">
                  <View className="flex flex-row items-center gap-1">
                    <User size={14} color="#64748B" />
                    <Text className="text-sm text-slate-600 block">姓名</Text>
                  </View>
                </Label>
                <View className="bg-slate-50 rounded-xl px-4 py-3">
                  <Input
                    className="w-full bg-transparent text-base"
                    placeholder="请输入就诊人姓名"
                    value={patientName}
                    onInput={(e) => setPatientName(e.detail.value)}
                  />
                </View>
              </View>

              <View>
                <Label className="text-sm text-slate-600 mb-2 block">
                  <View className="flex flex-row items-center gap-1">
                    <Phone size={14} color="#64748B" />
                    <Text className="text-sm text-slate-600 block">手机号</Text>
                  </View>
                </Label>
                <View className="bg-slate-50 rounded-xl px-4 py-3">
                  <Input
                    className="w-full bg-transparent text-base"
                    placeholder="请输入手机号"
                    type="number"
                    maxlength={11}
                    value={patientPhone}
                    onInput={(e) => setPatientPhone(e.detail.value)}
                  />
                </View>
              </View>

              <View>
                <Label className="text-sm text-slate-600 mb-2 block">
                  <View className="flex flex-row items-center gap-1">
                    <CreditCard size={14} color="#64748B" />
                    <Text className="text-sm text-slate-600 block">身份证号</Text>
                  </View>
                </Label>
                <View className="bg-slate-50 rounded-xl px-4 py-3">
                  <Input
                    className="w-full bg-transparent text-base"
                    placeholder="请输入身份证号"
                    value={patientIdCard}
                    onInput={(e) => setPatientIdCard(e.detail.value)}
                  />
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 提交按钮 */}
      <View className="px-4 pb-6">
        <Button
          className="w-full h-12 bg-orange-500 text-white text-lg font-semibold rounded-xl active:opacity-90"
          onClick={handleSubmit}
        >
          <Text className="text-lg text-white font-semibold block">确认预约</Text>
        </Button>
      </View>
    </ScrollView>
  )
}

export default BookingFormPage
