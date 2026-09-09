import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { Network } from '@/network'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { departments, type Department } from '@/data/mock-data'
import { cn } from '@/lib/utils'

interface ApptItem {
  id: string
  patientName: string
  patientPhone: string
  patientIdCard: string
  departmentName?: string
  doctorName?: string
  doctorTitle?: string
  date: string
  timeSlot: string
  status: 'confirmed' | 'cancelled'
  createdAt?: string
}

interface QuotaInfo {
  date: string
  morningQuota: number
  afternoonQuota: number
  morningLeft: number
  afternoonLeft: number
  isHoliday: boolean
}

interface BlackItem {
  id: string
  name: string
  idCard: string
  reason?: string
  createdAt?: string
}

function genDates(): { date: string; label: string }[] {
  const arr: { date: string; label: string }[] = []
  const labels = ['今天', '明天', '后天']
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const date = `${d.getFullYear()}-${mm}-${dd}`
    const label = i < 3 ? labels[i] : `${mm}月${dd}日`
    arr.push({ date, label })
  }
  return arr
}

async function unwrap(p: Promise<any>) {
  const res = await p
  // eslint-disable-next-line no-console
  console.log('API', res)
  if (res?.statusCode === 200) return res.data || {}
  return {}
}

export default function AdminMgmt() {
  const dates = genDates()
  const [activeTab, setActiveTab] = useState('appointments')
  const [appts, setAppts] = useState<ApptItem[]>([])
  const [selDate, setSelDate] = useState(dates[0].date)

  // 号源设置
  const [deptList] = useState<Department[]>(departments)
  const [selDeptId, setSelDeptId] = useState(departments[0]?.id || '')
  const [selQuotaDate, setSelQuotaDate] = useState(dates[0].date)
  const [morning, setMorning] = useState('20')
  const [afternoon, setAfternoon] = useState('15')
  const [isHoliday, setIsHoliday] = useState(false)

  // 黑名单
  const [blackList, setBlackList] = useState<BlackItem[]>([])
  const [bkName, setBkName] = useState('')
  const [bkIdCard, setBkIdCard] = useState('')
  const [bkReason, setBkReason] = useState('')

  const loadAppts = async () => {
    const { data } = await unwrap(Network.request({ url: '/api/appointments/admin/list' }))
    setAppts((data?.list || data || []) as ApptItem[])
  }

  const loadQuota = async (deptId: string, date: string) => {
    const dept = departments.find((d) => d.id === deptId)
    const { data } = await unwrap(
      Network.request({
        url: '/api/admin/quota',
        data: { departmentId: deptId, departmentName: dept?.name || '', dates: date },
      }),
    )
    const rows: QuotaInfo[] = data?.rows || data || []
    const row = rows.find((r) => r.date === date)
    if (row) {
      setMorning(String(row.morningQuota))
      setAfternoon(String(row.afternoonQuota))
      setIsHoliday(!!row.isHoliday)
    }
  }

  const loadBlack = async () => {
    const { data } = await unwrap(Network.request({ url: '/api/admin/blacklist' }))
    setBlackList((data?.list || data || []) as BlackItem[])
  }

  useEffect(() => {
    loadAppts()
    loadBlack()
    loadQuota(departments[0]?.id || '', dates[0].date)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCancel = async (id: string) => {
    await unwrap(Network.request({ url: '/api/appointments/cancel', method: 'POST', data: { id } }))
    await loadAppts()
  }

  const handleSaveQuota = async () => {
    const dept = departments.find((d) => d.id === selDeptId)
    const res = await unwrap(
      Network.request({
        url: '/api/admin/quota',
        method: 'POST',
        data: {
          departmentId: selDeptId,
          departmentName: dept?.name || '',
          date: selQuotaDate,
          morningQuota: Number(morning) || 0,
          afternoonQuota: Number(afternoon) || 0,
          isHoliday,
        },
      }),
    )
    if (res?.code === 200) {
      await loadQuota(selDeptId, selQuotaDate)
    }
  }

  const handleSaveInitial = async (deptId: string, date: string) => {
    const dept = departments.find((d) => d.id === deptId)
    await unwrap(
      Network.request({
        url: '/api/admin/quota',
        method: 'POST',
        data: {
          departmentId: deptId,
          departmentName: dept?.name || '',
          date,
          morningQuota: Number(morning) || 0,
          afternoonQuota: Number(afternoon) || 0,
          isHoliday,
        },
      }),
    )
    await loadQuota(deptId, date)
  }

  const handleAddBlack = async () => {
    if (!bkName || !bkIdCard) return
    await unwrap(
      Network.request({
        url: '/api/admin/blacklist',
        method: 'POST',
        data: { name: bkName, idCard: bkIdCard, reason: bkReason },
      }),
    )
    setBkName('')
    setBkIdCard('')
    setBkReason('')
    await loadBlack()
  }

  const handleRemoveBlack = async (id: string) => {
    await unwrap(Network.request({ url: '/api/admin/blacklist?id=' + id, method: 'DELETE' }))
    await loadBlack()
  }

  const filtered = appts.filter((a) => a.date === selDate && a.status !== 'cancelled')
  const isTodayQuota = selQuotaDate === dates[0].date

  return (
    <View className="min-h-screen bg-gray-50 pb-10">
      <View className="bg-teal-600 px-4 py-4">
        <Text className="block text-xl font-bold text-white">卫生院管理后台</Text>
        <Text className="block text-sm text-teal-50 mt-1">预约管理 · 号源设置 · 黑名单管理</Text>
      </View>

      <View className="px-4 mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 !h-11">
            <TabsTrigger value="appointments">预约管理</TabsTrigger>
            <TabsTrigger value="quota">号源设置</TabsTrigger>
            <TabsTrigger value="blacklist">黑名单</TabsTrigger>
          </TabsList>

          {/* 预约管理 */}
          <TabsContent value="appointments" className="mt-3">
            <View className="flex flex-wrap gap-2 mb-3">
              {dates.map((d) => (
                <Button
                  key={d.date}
                  size="sm"
                  variant={selDate === d.date ? 'default' : 'outline'}
                  className={cn(selDate === d.date ? 'bg-teal-600' : '')}
                  onClick={() => setSelDate(d.date)}
                >
                  <Text className="text-xs">{d.label}</Text>
                </Button>
              ))}
            </View>
            {filtered.length === 0 ? (
              <View className="bg-white rounded-2xl p-8 text-center">
                <Text className="block text-gray-400">该日期暂无预约</Text>
              </View>
            ) : (
              filtered.map((a) => (
                <View key={a.id} className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
                  <View className="flex flex-row items-center justify-between">
                    <Text className="block text-base font-semibold">
                      {a.patientName}
                      <Text className="text-xs font-normal text-gray-400 ml-2">{a.patientPhone}</Text>
                    </Text>
                    <Badge variant="secondary">
                      <Text className="text-xs">{a.date} {a.timeSlot}</Text>
                    </Badge>
                  </View>
                  <View className="mt-2 flex flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="block text-sm text-gray-600">{a.departmentName} · {a.doctorName}（{a.doctorTitle}）</Text>
                      <Text className="block text-xs text-gray-400 mt-1">身份证：{a.patientIdCard}</Text>
                    </View>
                    <Button size="sm" variant="destructive" onClick={() => handleCancel(a.id)}>
                      <Text className="text-xs">取消</Text>
                    </Button>
                  </View>
                </View>
              ))
            )}
          </TabsContent>

          {/* 号源设置 */}
          <TabsContent value="quota" className="mt-3">
            <View className="bg-white rounded-2xl p-4 shadow-sm">
              <Text className="block text-base font-semibold mb-2">选择科室</Text>
              <View className="flex flex-wrap gap-2">
                {deptList.map((d) => (
                  <Button
                    key={d.id}
                    size="sm"
                    variant={selDeptId === d.id ? 'default' : 'outline'}
                    className={cn(selDeptId === d.id ? 'bg-teal-600' : '')}
                    onClick={() => {
                      setSelDeptId(d.id)
                      loadQuota(d.id, selQuotaDate)
                    }}
                  >
                    <Text className="text-xs">{d.name}</Text>
                  </Button>
                ))}
              </View>
            </View>

            <View className="bg-white rounded-2xl p-4 mt-3 shadow-sm">
              <Text className="block text-base font-semibold mb-2">选择日期</Text>
              <View className="flex flex-wrap gap-2">
                {dates.map((d) => (
                  <Button
                    key={d.date}
                    size="sm"
                    variant={selQuotaDate === d.date ? 'default' : 'outline'}
                    className={cn(selQuotaDate === d.date ? 'bg-teal-600' : '')}
                    onClick={() => {
                      setSelQuotaDate(d.date)
                      loadQuota(selDeptId, d.date)
                    }}
                  >
                    <Text className="text-xs">{d.label}</Text>
                  </Button>
                ))}
              </View>
            </View>

            <View className="bg-white rounded-2xl p-4 mt-3 shadow-sm">
              <Text className="block text-base font-semibold mb-3">号源数量设置</Text>
              <View className="flex flex-row gap-3 mb-3">
                <View className="flex-1">
                  <Text className="block text-sm text-gray-500 mb-1">上午号源（08:00-12:00）</Text>
                  <Input type="number" value={morning} onInput={(e: any) => setMorning(e.detail.value)} />
                </View>
                <View className="flex-1">
                  <Text className="block text-sm text-gray-500 mb-1">下午号源（14:00-17:00）</Text>
                  <Input type="number" value={afternoon} onInput={(e: any) => setAfternoon(e.detail.value)} />
                </View>
              </View>
              <View className="flex flex-row items-center justify-between mb-3 p-3 bg-gray-50 rounded-xl">
                <Text className="block text-sm text-gray-700">是否设为本日节假日（暂停接诊）</Text>
                <Button
                  size="sm"
                  variant={isHoliday ? 'default' : 'outline'}
                  className={cn(isHoliday ? 'bg-amber-500' : '')}
                  onClick={() => setIsHoliday(!isHoliday)}
                >
                  <Text className="text-xs">{isHoliday ? '节假日' : '正常接诊'}</Text>
                </Button>
              </View>
              <Button className="w-full bg-teal-600" onClick={handleSaveQuota}>
                <Text>保存号源设置</Text>
              </Button>
              {!isTodayQuota && (
                <Button
                  className="w-full mt-2 bg-sky-500"
                  onClick={() => handleSaveInitial(selDeptId, selQuotaDate)}
                >
                  <Text>将该设置应用到全部科室该日期</Text>
                </Button>
              )}
            </View>
          </TabsContent>

          {/* 黑名单管理 */}
          <TabsContent value="blacklist" className="mt-3">
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-3">
              <Text className="block text-base font-semibold mb-3">添加黑名单</Text>
              <View className="mb-3">
                <Text className="block text-sm text-gray-500 mb-1">姓名</Text>
                <Input value={bkName} onInput={(e: any) => setBkName(e.detail.value)} placeholder="请输入姓名" />
              </View>
              <View className="mb-3">
                <Text className="block text-sm text-gray-500 mb-1">身份证号</Text>
                <Input value={bkIdCard} onInput={(e: any) => setBkIdCard(e.detail.value)} placeholder="请输入身份证号" />
              </View>
              <View className="mb-3">
                <Text className="block text-sm text-gray-500 mb-1">拉黑原因（选填）</Text>
                <Input value={bkReason} onInput={(e: any) => setBkReason(e.detail.value)} placeholder="请输入拉黑原因" />
              </View>
              <Button className="w-full bg-teal-600" onClick={handleAddBlack}>
                <Text>添加到黑名单</Text>
              </Button>
            </View>

            {blackList.length === 0 ? (
              <View className="bg-white rounded-2xl p-8 text-center">
                <Text className="block text-gray-400">暂无黑名单记录</Text>
              </View>
            ) : (
              blackList.map((b) => (
                <View key={b.id} className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
                  <View className="flex flex-row items-center justify-between">
                    <Text className="block text-base font-semibold">{b.name}</Text>
                    <Badge variant="destructive">
                      <Text className="text-xs">已拉黑</Text>
                    </Badge>
                  </View>
                  <Text className="block text-sm text-gray-600 mt-1">身份证：{b.idCard}</Text>
                  {b.reason ? <Text className="block text-xs text-gray-400 mt-1">原因：{b.reason}</Text> : null}
                  <Button className="mt-2 self-start" size="sm" variant="outline" onClick={() => handleRemoveBlack(b.id)}>
                    <Text className="text-xs">移除黑名单</Text>
                  </Button>
                </View>
              ))
            )}
          </TabsContent>
        </Tabs>
      </View>
    </View>
  )
}