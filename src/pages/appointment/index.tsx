import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  Stethoscope,
  Scissors,
  Baby,
  Leaf,
  HeartPulse,
  Heart,
  Syringe,
  Smile,
  ChevronRight,
  CalendarClock,
  ListOrdered,
} from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { departments, doctors } from '@/data/mock-data'

// 只显示有医生的科室
const departmentsWithDoctors = departments.filter((dept) =>
  doctors.some((doc) => doc.departmentId === dept.id)
)

const iconMap: Record<string, React.ComponentType<any>> = {
  Stethoscope,
  Scissors,
  Baby,
  Leaf,
  HeartPulse,
  Heart,
  Syringe,
  Smile,
}

const IndexPage = () => {
  const handleSelectDept = (deptId: string) => {
    Taro.navigateTo({ url: `/pages/appointment/doctor-select?departmentId=${deptId}` })
  }

  const handleMyAppointments = () => {
    Taro.navigateTo({ url: '/pages/appointment/my-appointments' })
  }

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 顶部操作区 */}
      <View className="px-4 pt-4">
        <Card
          className="bg-teal-600 rounded-xl shadow-sm"
          onClick={handleMyAppointments}
        >
          <CardContent className="p-4 flex flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <CalendarClock size={20} color="#0D9488" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-white block">我的预约</Text>
              <Text className="text-xs text-teal-100 block mt-1">查看预约记录、取消预约</Text>
            </View>
            <ChevronRight size={18} color="#ffffff" />
          </CardContent>
        </Card>
      </View>

      {/* 科室选择 */}
      <View className="px-4 mt-4 mb-6">
        <View className="flex flex-row items-center gap-2 mb-3">
          <ListOrdered size={18} color="#0D9488" />
          <Text className="text-lg font-bold text-slate-800 block">选择科室</Text>
        </View>

        <View className="flex flex-col gap-3">
          {departmentsWithDoctors.map((dept) => {
            const IconComp = iconMap[dept.icon] || Stethoscope
            return (
              <Card
                key={dept.id}
                className="bg-white rounded-xl shadow-sm active:opacity-80"
                onClick={() => handleSelectDept(dept.id)}
              >
                <CardContent className="p-4 flex flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <IconComp size={24} color="#0D9488" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-slate-800 block">
                      {dept.name}
                    </Text>
                    <Text className="text-sm text-slate-500 block mt-1 leading-relaxed">
                      {dept.description}
                    </Text>
                    <Text className="text-xs text-slate-400 block mt-1">
                      位置：{dept.location}
                    </Text>
                  </View>
                  <ChevronRight size={18} color="#94A3B8" />
                </CardContent>
              </Card>
            )
          })}
        </View>
      </View>
    </ScrollView>
  )
}

export default IndexPage
