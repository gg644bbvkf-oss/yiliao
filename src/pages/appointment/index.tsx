import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import {
  Stethoscope,
  Flower2,
  Hospital,
  ChevronRight,
  ListOrdered,
} from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Network } from '@/network'
import { useState } from 'react'

interface Department {
  id: string
  name: string
  description: string
  icon: string
  location: string
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Stethoscope,
  Flower2,
  Hospital,
}

const IndexPage = () => {
  const [departments, setDepartments] = useState<Department[]>([])

  useLoad(() => {
    loadDepartments()
  })

  const loadDepartments = async () => {
    try {
      const res = await Network.request({ url: '/api/content/departments' })
      setDepartments(res.data?.data || [])
    } catch {
      setDepartments([])
    }
  }

  const handleSelectDept = (dept: Department) => {
    Taro.navigateTo({
      url: `/pages/appointment/booking-form?departmentId=${dept.id}&departmentName=${encodeURIComponent(
        dept.name
      )}`,
    })
  }

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 科室选择 */}
      <View className="px-4 pt-4 mb-6">
        <View className="flex flex-row items-center gap-2 mb-3">
          <ListOrdered size={18} color="#0D9488" />
          <Text className="text-lg font-bold text-slate-800 block">选择科室</Text>
        </View>

        {departments.length === 0 ? (
          <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
              <Text className="block text-center text-slate-500">
                暂无科室，请到管理后台添加
              </Text>
            </CardContent>
          </Card>
        ) : (
          <View className="flex flex-col gap-3">
            {departments.map((dept) => {
              const IconComp = iconMap[dept.icon] || Stethoscope
              return (
                <Card
                  key={dept.id}
                  className="bg-white rounded-xl shadow-sm active:opacity-80"
                  onClick={() => handleSelectDept(dept)}
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
        )}
      </View>
    </ScrollView>
  )
}

export default IndexPage