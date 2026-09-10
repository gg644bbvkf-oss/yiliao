import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Network } from '@/network'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { LockKeyhole } from 'lucide-react-taro'
import type { Department } from '@/data/mock-data'
import { cn } from '@/lib/utils'
import ContentMgmt from '@/components/content-mgmt'
import { getAdmin, getAdminToken, setAdminInfo } from '@/utils/admin'

const ADMIN_PHONE_KEY = 'hospital_admin_phone'

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
  const [deptList, setDeptList] = useState<Department[]>([])
  const [selDeptId, setSelDeptId] = useState('')
  const [selQuotaDate, setSelQuotaDate] = useState(dates[0].date)
  const [morning, setMorning] = useState('10')
  const [afternoon, setAfternoon] = useState('5')
  const [isHoliday, setIsHoliday] = useState(false)

  // 登录
  const [loggedIn, setLoggedIn] = useState<boolean>(!!getAdminToken())
  const [phone, setPhone] = useState('')
  const [pwd, setPwd] = useState('')
  const [loginErr, setLoginErr] = useState('')

  // 修改密码
  const [showPwd, setShowPwd] = useState(false)
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')

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
    const dept = deptList.find((d) => d.id === deptId)
    const { data } = await unwrap(
      Network.request({
        url: '/api/admin/quota',
        data: { departmentId: deptId, departmentName: dept?.name || '', dates: date },
      }),
    )
    const rows: QuotaInfo[] = data?.rows || data || []
    const row = rows.find((r) => r.date === date)
    if (row) {
      // 非节假日但号源为 0（节假日恢复接诊遗留）时，回填默认号源，避免保存后显示"已满"
      setMorning(row.isHoliday ? '0' : (Number(row.morningQuota) > 0 ? String(row.morningQuota) : '10'))
      setAfternoon(row.isHoliday ? '0' : (Number(row.afternoonQuota) > 0 ? String(row.afternoonQuota) : '5'))
      setIsHoliday(!!row.isHoliday)
    } else {
      // 该日期无记录时回落到默认号源：上午10、下午5
      setMorning('10')
      setAfternoon('5')
      setIsHoliday(false)
    }
  }

  const loadBlack = async () => {
    const { data } = await unwrap(Network.request({ url: '/api/admin/blacklist' }))
    setBlackList((data?.list || data || []) as BlackItem[])
  }

  const loadDepts = async () => {
    const { data } = await unwrap(Network.request({ url: '/api/content/departments' }))
    const list = (data?.list || data || []) as Department[]
    setDeptList(list)
    if (list.length) {
      const cur = list.find((d) => d.id === selDeptId) ? selDeptId : list[0].id
      setSelDeptId(cur)
      loadQuota(cur, selQuotaDate)
    }
  }

  const handleLogin = async () => {
    setLoginErr('')
    if (!phone || !pwd) {
      setLoginErr('请输入手机号和密码')
      return
    }
    try {
      // eslint-disable-next-line no-console
      console.log('login request', { phone, pwd })
      const res: any = await Network.request({
        url: '/api/content/admin/verify',
        method: 'GET',
        header: { 'x-admin-phone': phone, 'x-admin-password': pwd },
      })
      // eslint-disable-next-line no-console
      console.log('login response', JSON.stringify(res))
      if (res?.data?.code === 200 && res?.data?.data?.isAdmin) {
        setAdminInfo(phone, pwd)
        Taro.setStorageSync(ADMIN_PHONE_KEY, phone)
        setLoggedIn(true)
      } else {
        setLoginErr(res?.data?.data === false || typeof res?.data === 'string'
          ? '手机号或密码错误'
          : '手机号或密码错误')
      }
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log('login error', e)
      const status = e?.statusCode
      setLoginErr(status === 401 ? '手机号或密码错误' : '登录失败，请稍后再试')
    }
  }

  const handleChangePwd = async () => {
    setPwdMsg('')
    if (!oldPwd || !newPwd || !confirmPwd) {
      setPwdMsg('请完整填写信息')
      return
    }
    if (newPwd.length < 6) {
      setPwdMsg('新密码至少 6 位')
      return
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg('两次输入的新密码不一致')
      return
    }
    const cred = getAdmin() // 存有当前登录凭证
    const adminPhone = cred?.phone ?? phone
    try {
      const res: any = await Network.request({
        url: '/api/content/admin/change-password',
        method: 'POST',
        header: { 'x-admin-phone': adminPhone, 'x-admin-password': oldPwd },
        data: { newPassword: newPwd },
      })
      if (res?.data?.code === 200) {
        setAdminInfo(adminPhone, newPwd)
        setPwdMsg('')
        setOldPwd('')
        setNewPwd('')
        setConfirmPwd('')
        setShowPwd(false)
        Taro.showToast({ title: '密码修改成功', icon: 'success' })
      } else {
        setPwdMsg(res?.data?.code === 401 ? '原密码错误' : '修改失败，请重试')
      }
    } catch (e: any) {
      setPwdMsg(e?.statusCode === 401 ? '原密码错误' : '修改失败，请检查网络')
    }
  }

  const handleLogout = async () => {
    try {
      Taro.clearStorageSync()
    } catch {
      /* ignore */
    }
    setLoggedIn(false)
    setPhone('')
    setPwd('')
  }

  const handleAuthFail = () => {
    setLoggedIn(false)
    setPwd('')
  }

  useEffect(() => {
    loadAppts()
    loadBlack()
    loadDepts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCancel = async (id: string) => {
    await unwrap(Network.request({ url: '/api/appointments/cancel', method: 'POST', data: { id } }))
    await loadAppts()
  }

  const handleSaveQuota = async () => {
    const dept = deptList.find((d) => d.id === selDeptId)
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

  if (!loggedIn) {
    return (
      <View className="min-h-screen bg-gray-50 pb-10">
        <View className="bg-teal-600 px-4 py-6">
          <Text className="block text-xl font-bold text-white">卫生院管理后台</Text>
          <Text className="block text-sm text-teal-50 mt-1">请输入管理员账号密码登录</Text>
        </View>
        <View className="px-4 mt-6">
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <Text className="block text-lg font-bold text-gray-800 text-center mb-4">管理员登录</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3 mb-3">
              <Input
                value={phone}
                onInput={(e) => setPhone(e.detail.value)}
                placeholder="请输入管理员手机号"
              />
            </View>
            <View className="bg-gray-50 rounded-xl px-4 py-3 mb-3">
              <Input
                value={pwd}
                onInput={(e) => setPwd(e.detail.value)}
                placeholder="请输入登录密码"
              />
            </View>
            {loginErr ? (
              <Text className="block text-sm text-red-500 text-center mb-3">{loginErr}</Text>
            ) : null}
            <Button className="w-full bg-teal-600 text-white py-3" onClick={handleLogin}>
              <Text className="text-base">登 录</Text>
            </Button>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-10">
      <View className="bg-teal-600 px-4 py-4">
        <View className="flex flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="block text-xl font-bold text-white">卫生院管理后台</Text>
            <Text className="block text-sm text-teal-50 mt-1">内容管理 · 预约管理 · 号源设置 · 黑名单</Text>
          </View>
          <View className="flex flex-row gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="bg-teal-500 text-white"
              onClick={() => {
                setShowPwd(true)
                setPwdMsg('')
              }}
            >
              <LockKeyhole size={14} color="#ffffff" className="mr-1" />
              <Text className="text-xs">改密</Text>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="bg-teal-500 text-white"
              onClick={handleLogout}
            >
              <Text className="text-xs">退出</Text>
            </Button>
          </View>
        </View>
      </View>

      <View className="px-4 mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 !h-11">
            <TabsTrigger value="content">内容管理</TabsTrigger>
            <TabsTrigger value="appointments">预约管理</TabsTrigger>
            <TabsTrigger value="quota">号源设置</TabsTrigger>
            <TabsTrigger value="blacklist">黑名单</TabsTrigger>
          </TabsList>

          {/* 内容管理 */}
          <TabsContent value="content" className="mt-3">
            <ContentMgmt onAuthFail={handleAuthFail} />
          </TabsContent>

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
              <Text className="block text-base font-semibold mb-1">节假日设置（全院生效）</Text>
              <Text className="block text-xs text-gray-400 mb-3">
                法定节假日已自动停诊；如需临时停诊或恢复接诊，切换后点保存即可，全院所有科室当日号源自动归 0
              </Text>
              <View className="flex flex-row items-center justify-between mb-3 p-3 bg-gray-50 rounded-xl">
                <Text className="block text-sm text-gray-700">{selQuotaDate} 当日状态</Text>
                <Button
                  size="sm"
                  variant={isHoliday ? 'default' : 'outline'}
                  className={cn(isHoliday ? 'bg-amber-500' : '')}
                  onClick={() => {
                    const next = !isHoliday
                    setIsHoliday(next)
                    // 切回"正常接诊"时，若号源为 0（节假日遗留），重置为默认号源
                    if (!next) {
                      if (Number(morning) <= 0) setMorning('10')
                      if (Number(afternoon) <= 0) setAfternoon('5')
                    }
                  }}
                >
                  <Text className="text-xs">{isHoliday ? '节假日停诊' : '正常接诊'}</Text>
                </Button>
              </View>
              <Button className="w-full bg-amber-500" onClick={handleSaveQuota}>
                <Text>{isHoliday ? '保存：全院停诊' : '保存：全院恢复接诊'}</Text>
              </Button>
            </View>

            <View className="bg-white rounded-2xl p-4 mt-3 shadow-sm">
              <Text className="block text-base font-semibold mb-3">全院号源数量设置（统一号源）</Text>
              <View className={`flex flex-row gap-3 mb-3 ${isHoliday ? 'opacity-40' : ''}`}>
                <View className="flex-1">
                  <Text className="block text-sm text-gray-500 mb-1">上午号源（08:00-12:00）</Text>
                  <Input
                    type="number"
                    value={isHoliday ? '0' : morning}
                    disabled={isHoliday}
                    onInput={(e: any) => setMorning(e.detail.value)}
                  />
                </View>
                <View className="flex-1">
                  <Text className="block text-sm text-gray-500 mb-1">下午号源（14:00-17:00）</Text>
                  <Input
                    type="number"
                    value={isHoliday ? '0' : afternoon}
                    disabled={isHoliday}
                    onInput={(e: any) => setAfternoon(e.detail.value)}
                  />
                </View>
              </View>
              <Button
                className="w-full bg-teal-600"
                onClick={handleSaveQuota}
                disabled={isHoliday}
              >
                <Text>{isHoliday ? '节假日停诊中' : '保存全院号源'}</Text>
              </Button>
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

      {/* 修改密码弹窗 */}
      <Dialog open={showPwd} onOpenChange={setShowPwd}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>修改管理员密码</DialogTitle>
          </DialogHeader>
          <View className="mt-2 space-y-3">
            <View>
              <Text className="block text-sm text-gray-500 mb-1">原密码</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  value={oldPwd}
                  onInput={(e: any) => setOldPwd(e.detail.value)}
                  placeholder="请输入当前密码"
                />
              </View>
            </View>
            <View>
              <Text className="block text-sm text-gray-500 mb-1">新密码（至少6位）</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  value={newPwd}
                  onInput={(e: any) => setNewPwd(e.detail.value)}
                  placeholder="请输入新密码"
                />
              </View>
            </View>
            <View>
              <Text className="block text-sm text-gray-500 mb-1">确认新密码</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  value={confirmPwd}
                  onInput={(e: any) => setConfirmPwd(e.detail.value)}
                  placeholder="请再次输入新密码"
                />
              </View>
            </View>
            {pwdMsg ? (
              <Text className="block text-sm text-red-500">{pwdMsg}</Text>
            ) : null}
          </View>
          <DialogFooter className="flex flex-row gap-3 mt-4">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => {
                setShowPwd(false)
                setOldPwd('')
                setNewPwd('')
                setConfirmPwd('')
                setPwdMsg('')
              }}
            >
              <Text>取消</Text>
            </Button>
            <Button className="flex-1 bg-teal-600" onClick={handleChangePwd}>
              <Text>确认修改</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  )
}