import { useState, useMemo, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { User, Phone, CreditCard, Clock } from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Network } from '@/network'
import { fetchQuota, FALLBACK_QUOTA } from '@/services/content'
import { getPatients } from '@/data/mock-data'

interface SlotData {
  morningLeft: number
  afternoonLeft: number
  morningQuota: number
  afternoonQuota: number
  isHoliday?: boolean
}

const genDates = (): string[] => {
  const arr: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    arr.push(`${y}-${m}-${day}`)
  }
  return arr
}

const BookingFormPage = () => {
  const router = useRouter()
  const departmentId = router.params.departmentId || ''
  const departmentName = router.params.departmentName
    ? decodeURIComponent(router.params.departmentName)
    : ''
  const dept = { id: departmentId, name: departmentName }

  const dates = useMemo(genDates, [])
  const [selectedDate, setSelectedDate] = useState(dates[0])
  const [period, setPeriod] = useState<'上午' | '下午'>('上午')
  const [slot, setSlot] = useState<SlotData>(FALLBACK_QUOTA)

  const savedPatients = useMemo(() => getPatients(), [])

  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [patientIdCard, setPatientIdCard] = useState('')
  const [selectedPatientIdx, setSelectedPatientIdx] = useState(-1)
  const [submitting, setSubmitting] = useState(false)

  const loadQuota = async (date: string) => {
    const q = await fetchQuota({ departmentId, departmentName, date })
    setSlot(q)
  }

  useEffect(() => {
    loadQuota(selectedDate)
  }, [selectedDate])

  const leftOfPeriod = (p: '上午' | '下午') =>
    p === '上午' ? slot.morningLeft : slot.afternoonLeft
  const quotaOfPeriod = (p: '上午' | '下午') =>
    p === '上午' ? slot.morningQuota : slot.afternoonQuota

  const handleSelectPatient = (idx: number) => {
    const p = savedPatients[idx]
    setSelectedPatientIdx(idx)
    setPatientName(p.name)
    setPatientPhone(p.phone)
    setPatientIdCard(p.idCard)
  }

  const handleSubmit = async () => {
    if (!departmentId) {
      Taro.showToast({ title: '科室参数缺失', icon: 'none' })
      return
    }
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

    setSubmitting(true)
    try {
      console.log('提交预约:', {
        patientName: patientName.trim(),
        patientPhone,
        patientIdCard,
        departmentId,
        departmentName,
        doctorId: '',
        doctorName: '',
        doctorTitle: '',
        date: selectedDate,
        timeSlot: period,
      })
      const res = await Network.request({
        url: '/api/appointments',
        method: 'POST',
        data: {
          patientName: patientName.trim(),
          patientPhone,
          patientIdCard,
          departmentId,
          departmentName,
          doctorId: '',
          doctorName: '',
          doctorTitle: '',
          date: selectedDate,
          timeSlot: period,
        },
      })
      console.log('预约响应:', res.data)
      const body = res.data as any
      const statusOk =
        (typeof res.statusCode === 'number' ? res.statusCode : 200) < 400
      if (statusOk && body?.code === 200 && body?.data) {
        Taro.setStorageSync('hospital_user_phone', patientPhone)
        Taro.redirectTo({
          url: `/pages/appointment/booking-result?id=${body.data.id}`,
        })
      } else {
        // 静态网页版（无后端）时提示改用电话预约，避免误导用户以为可在线挂号
        const offline =
          !statusOk ||
          typeof body === 'string' ||
          (body && typeof body === 'object' && !('code' in body))
        Taro.showModal({
          title: offline ? '网页版暂不支持在线预约' : '预约失败',
          content: offline
            ? '网页版暂不支持在线提交预约，请拨打咨询电话 0910-1234567890 或到院挂号，也可在微信小程序中预约。'
            : body?.msg || '请稍后重试',
          showCancel: false,
          confirmText: '我知道了',
        })
      }
    } catch (err) {
      console.error('预约失败:', err)
      Taro.showModal({
        title: '网页版暂不支持在线预约',
        content: '网络不可用，请拨打咨询电话 0910-1234567890 或到院挂号，也可在微信小程序中预约。',
        showCancel: false,
        confirmText: '我知道了',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 预约科室与日期 */}
      <View className="px-4 pt-4">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-4">
            <Text className="text-base font-bold text-slate-800 block mb-3">
              预约信息
            </Text>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm text-slate-500 block">科室</Text>
              <Text className="text-base font-semibold text-slate-800 block">
                {dept.name}
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 选择日期 */}
      <View className="px-4 mt-4">
        <Text className="text-sm text-slate-600 block mb-2">选择就诊日期</Text>
        <ScrollView scrollX className="w-full">
          <View className="flex flex-row gap-2 pb-2">
            {dates.map((d, idx) => (
              <View
                key={d}
                className={`flex-shrink-0 px-4 py-3 rounded-xl active:opacity-80 ${
                  selectedDate === d
                    ? 'bg-teal-600'
                    : 'bg-white border border-slate-200'
                }`}
                onClick={() => {
                  setSelectedDate(d)
                }}
              >
                <Text
                  className={`text-sm font-semibold block ${
                    selectedDate === d ? 'text-white' : 'text-slate-700'
                  }`}
                >
                  {idx === 0 ? '今天' : '周' + ['日', '一', '二', '三', '四', '五', '六'][new Date(d).getDay()]}
                </Text>
                <Text
                  className={`text-xs block mt-1 ${
                    selectedDate === d ? 'text-teal-100' : 'text-slate-400'
                  }`}
                >
                  {d.slice(5)}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 选择时段 */}
      <View className="px-4 mt-4">
        <Text className="text-sm text-slate-600 block mb-2">选择就诊时段</Text>
        <View className="flex flex-row gap-3">
          {(['上午', '下午'] as const).map((p) => (
            <View key={p} className="flex-1">
              <View
                className={`rounded-xl p-4 active:opacity-80 ${
                  period === p ? 'bg-teal-600' : 'bg-white border border-slate-200'
                }`}
                onClick={() => setPeriod(p)}
              >
                <View className="flex flex-row items-center gap-1">
                  <Clock size={14} color={period === p ? '#ffffff' : '#0D9488'} />
                  <Text
                    className={`text-base font-semibold block ${
                      period === p ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    {p}
                  </Text>
                </View>
                <Text
                  className={`text-xs block mt-1 ${
                    period === p ? 'text-teal-100' : 'text-slate-400'
                  }`}
                >
                  {p === '上午' ? '8:00-11:30' : '14:00-17:00'}
                </Text>
                <Text
                  className={`text-xs block mt-1 ${
                    period === p ? 'text-teal-100' : 'text-orange-500'
                  }`}
                >
                  剩余 {leftOfPeriod(p)} / {quotaOfPeriod(p)} 个号
                </Text>
              </View>
            </View>
          ))}
        </View>
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
            <Text className="text-base font-bold text-slate-800 block mb-4">
              就诊人信息
            </Text>

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
          disabled={submitting}
        >
          <Text className="text-lg text-white font-semibold block">
            {submitting ? '提交中...' : '确认预约'}
          </Text>
        </Button>
      </View>
    </ScrollView>
  )
}

export default BookingFormPage