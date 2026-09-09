import { useState, useCallback, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import {
  User,
  CalendarClock,
  Heart,
  Users,
  ChevronRight,
  Settings,
  ShieldCheck,
} from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Network } from '@/network'
import { getAppointments, getPatients, getFavorites, healthArticles, getDateDisplay } from '@/data/mock-data'

const ADMIN_PHONE_KEY = 'hospital_admin_phone'
const USER_PHONE_KEY = 'hospital_user_phone'

const menuItems = [
  { name: '就诊人管理', icon: Users, page: '/pages/profile/patient-manage', desc: '管理就诊人信息' },
  { name: '我的预约', icon: CalendarClock, page: '/pages/appointment/my-appointments', desc: '查看预约记录' },
  { name: '管理后台', icon: ShieldCheck, page: '/pages/profile/admin-mgmt', desc: '预约管理 / 号源设置 / 黑名单', admin: true },
  { name: '我的收藏', icon: Heart, page: '', desc: '收藏的健康文章' },
]

const ProfilePage = () => {
  const [patientCount, setPatientCount] = useState(0)
  const [appointmentCount, setAppointmentCount] = useState(0)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminPhone, setAdminPhone] = useState('')
  const [adminChecking, setAdminChecking] = useState(false)
  const [userPhone, setUserPhone] = useState(() => Taro.getStorageSync(USER_PHONE_KEY) || '')

  const refreshCounts = useCallback(() => {
    setPatientCount(getPatients().length)
    setAppointmentCount(getAppointments().filter((a) => a.status === 'pending').length)
    setFavoriteCount(getFavorites().length)
    setUserPhone(Taro.getStorageSync(USER_PHONE_KEY) || '')
  }, [])

  useEffect(() => {
    refreshCounts()
  }, [refreshCounts])

  useDidShow(() => {
    refreshCounts()
  })

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.name === '我的收藏') {
      setShowFavorites(!showFavorites)
    } else if ((item as any).admin) {
      // 管理员功能需验证身份
      const saved = Taro.getStorageSync(ADMIN_PHONE_KEY)
      if (saved) {
        Taro.navigateTo({ url: item.page })
      } else {
        setAdminPhone('')
        setShowAdminLogin(true)
      }
    } else if (item.page) {
      Taro.navigateTo({ url: item.page })
    }
  }

  const handleAdminLogin = async () => {
    if (!adminPhone.trim()) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    setAdminChecking(true)
    try {
      const res: any = await Network.request({
        url: `/api/admin/check?phone=${adminPhone.trim()}`,
        method: 'GET',
      })
      console.log('admin check res:', JSON.stringify(res))
      const isAdmin = res?.data?.data?.isAdmin
      if (isAdmin) {
        Taro.setStorageSync(ADMIN_PHONE_KEY, adminPhone.trim())
        setShowAdminLogin(false)
        Taro.navigateTo({ url: '/pages/profile/admin-mgmt' })
      } else {
        Taro.showToast({ title: '该手机号不是管理员', icon: 'none' })
      }
    } catch (e) {
      console.log('admin check error:', e)
      Taro.showToast({ title: '识别失败，请重试', icon: 'none' })
    } finally {
      setAdminChecking(false)
    }
  }

  const counts = [patientCount, appointmentCount, favoriteCount]

  const favoriteArticles = healthArticles.filter((a) =>
    getFavorites().includes(a.id)
  )

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 用户信息区 */}
      <View className="bg-teal-600 px-4 pt-6 pb-8">
        <View className="flex flex-row items-center gap-4">
          <View className="w-16 h-16 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <User size={32} color="#0D9488" />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-white block">{userPhone || '居民用户'}</Text>
            <Text className="text-sm text-teal-100 block mt-1">旬邑县城关镇卫生院为您服务</Text>
          </View>
          <Settings size={22} color="#ffffff" />
        </View>
      </View>

      {/* 数据统计 */}
      <View className="px-4 -mt-4">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-4 flex flex-row">
            {menuItems.filter((m: any) => !m.admin).map((item, idx) => (
              <View
                key={item.name}
                className="flex-1 flex flex-col items-center gap-1"
                onClick={() => handleMenuClick(item)}
              >
                <Text className="text-2xl font-bold text-teal-600 block">
                  {counts[idx]}
                </Text>
                <Text className="text-xs text-slate-500 block">{item.name}</Text>
              </View>
            ))}
          </CardContent>
        </Card>
      </View>

      {/* 功能菜单 */}
      <View className="px-4 mt-4 mb-4">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-0">
            {menuItems.map((item, idx) => {
              const IconComp = item.icon
              return (
                <View key={item.name}>
                  {idx > 0 && <View className="h-px bg-slate-100 mx-4" />}
                  <View
                    className="flex flex-row items-center gap-3 px-4 py-4 active:bg-slate-50"
                    onClick={() => handleMenuClick(item)}
                  >
                    <View className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <IconComp size={20} color="#0D9488" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-slate-800 block">
                        {item.name}
                      </Text>
                      <Text className="text-xs text-slate-400 block mt-1">
                        {item.desc}
                      </Text>
                    </View>
                    <ChevronRight size={18} color="#94A3B8" />
                  </View>
                </View>
              )
            })}
          </CardContent>
        </Card>
      </View>

      {/* 收藏列表 */}
      {showFavorites && (
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-slate-800 block mb-3">收藏的文章</Text>
          {favoriteArticles.length === 0 ? (
            <Card className="bg-white rounded-xl shadow-sm">
              <CardContent className="p-6 flex items-center justify-center">
                <Text className="text-sm text-slate-400 block text-center">
                  暂无收藏文章
                </Text>
              </CardContent>
            </Card>
          ) : (
            <View className="flex flex-col gap-3">
              {favoriteArticles.map((article) => (
                <Card key={article.id} className="bg-white rounded-xl shadow-sm">
                  <CardContent className="p-4">
                    <Text className="text-base font-semibold text-slate-800 block">
                      {article.title}
                    </Text>
                    <View className="flex flex-row items-center gap-2 mt-2">
                      <Badge
                        variant="secondary"
                        className="bg-teal-50 text-teal-700 border-0 text-xs"
                      >
                        {article.category}
                      </Badge>
                      <Text className="text-xs text-slate-400 block">{article.date}</Text>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          )}
        </View>
      )}

      {/* 最近预约 */}
      {getAppointments().filter((a) => a.status === 'pending').length > 0 && (
        <View className="px-4 mb-6">
          <View className="flex flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-slate-800 block">待就诊预约</Text>
            <View
              className="flex flex-row items-center gap-1"
              onClick={() => Taro.navigateTo({ url: '/pages/appointment/my-appointments' })}
            >
              <Text className="text-sm text-teal-600 block">查看全部</Text>
              <ChevronRight size={14} color="#0D9488" />
            </View>
          </View>
          <View className="flex flex-col gap-3">
            {getAppointments()
              .filter((a) => a.status === 'pending')
              .slice(0, 2)
              .map((apt) => (
                <Card key={apt.id} className="bg-white rounded-xl shadow-sm">
                  <CardContent className="p-4">
                    <View className="flex flex-row items-center justify-between mb-2">
                      <Text className="text-base font-semibold text-slate-800 block">
                        {apt.departmentName} - {apt.doctorName}
                      </Text>
                      <Badge
                        variant="secondary"
                        className="bg-teal-50 text-teal-700 border-0 text-xs"
                      >
                        待就诊
                      </Badge>
                    </View>
                    <Text className="text-sm text-slate-500 block">
                      {getDateDisplay(apt.date)}{' '}
                      {apt.period === 'morning' ? '上午' : '下午'} | 就诊人：
                      {apt.patientName}
                    </Text>
                  </CardContent>
                </Card>
              ))}
          </View>
        </View>
      )}

      {/* 快捷操作 */}
      <View className="px-4 pb-6">
        <Button
          className="w-full h-11 bg-white text-teal-600 border border-teal-200 rounded-xl"
          onClick={() => Taro.switchTab({ url: '/pages/appointment/index' })}
        >
          <CalendarClock size={18} color="#0D9488" />
          <Text className="text-base text-teal-600 font-semibold block">预约挂号</Text>
        </Button>
      </View>

      {/* 管理员登录弹层 */}
      {showAdminLogin && (
        <View
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 32px',
          }}
          onClick={() => setShowAdminLogin(false)}
        >
          <View
            className="bg-white rounded-2xl w-full"
            style={{ maxWidth: 360 }}
            onClick={(e: any) => e.stopPropagation()}
          >
            <View className="p-6">
              <View className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-3">
                <ShieldCheck size={24} color="#0D9488" />
              </View>
              <Text className="text-lg font-bold text-slate-800 block">
                管理员验证
              </Text>
              <Text className="text-sm text-slate-500 block mt-1">
                请输入管理员手机号以进入后台管理
              </Text>
              <View className="mt-4">
                <View className="bg-slate-50 rounded-xl px-4 py-3">
                  <Input
                    style={{ width: '100%', fontSize: '16px' }}
                    placeholder="管理员手机号"
                    type="number"
                    maxlength={11}
                    value={adminPhone}
                    onInput={(e: any) => setAdminPhone(e.detail.value)}
                  />
                </View>
              </View>
              <View className="mt-5 flex flex-row gap-3">
                <Button
                  className="flex-1 h-11 bg-slate-100 text-slate-600 rounded-xl"
                  onClick={() => setShowAdminLogin(false)}
                >
                  取消
                </Button>
                <Button
                  className="flex-1 h-11 bg-teal-600 text-white rounded-xl"
                  disabled={adminChecking}
                  onClick={() => handleAdminLogin()}
                >
                  {adminChecking ? '验证中...' : '进入后台'}
                </Button>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default ProfilePage
