import { useState } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  Stethoscope,
  ChevronRight,
} from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { departments, doctors } from '@/data/mock-data'

const HospitalPage = () => {
  const [activeTab, setActiveTab] = useState('doctors')

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 顶部标题 */}
      <View className="bg-teal-600 px-4 pt-4 pb-6">
        <Text className="text-xl font-bold text-white block">医生团队</Text>
        <Text className="text-sm text-teal-100 block mt-1">专业可靠，用心服务</Text>
      </View>

      {/* Tab 切换 */}
      <View className="px-4 -mt-3">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white rounded-xl shadow-sm h-auto p-1 w-full">
            <View className="flex flex-row w-full">
              <TabsTrigger
                value="doctors"
                className="flex-1 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg py-2"
              >
                <Text className="text-sm block">全部医生</Text>
              </TabsTrigger>
              <TabsTrigger
                value="departments"
                className="flex-1 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg py-2"
              >
                <Text className="text-sm block">按科室查看</Text>
              </TabsTrigger>
            </View>
          </TabsList>

          {/* 全部医生 */}
          <TabsContent value="doctors" className="mt-3 mb-6">
            <View className="flex flex-col gap-3">
              {doctors.map((doc) => (
                <Card
                  key={doc.id}
                  className="bg-white rounded-xl shadow-sm active:opacity-80"
                  onClick={() =>
                    Taro.navigateTo({
                      url: `/pages/hospital/doctor-detail?id=${doc.id}`,
                    })
                  }
                >
                  <CardContent className="p-4 flex flex-row items-center gap-3">
                    <Image
                      src={doc.avatar}
                      className="w-12 h-12 rounded-full flex-shrink-0"
                      mode="aspectFill"
                    />
                    <View className="flex-1">
                      <View className="flex flex-row items-center gap-2">
                        <Text className="text-base font-semibold text-slate-800 block">
                          {doc.name}
                        </Text>
                        <Badge
                          variant="secondary"
                          className="bg-teal-50 text-teal-700 border-0 text-xs"
                        >
                          {doc.title}
                        </Badge>
                      </View>
                      <Text className="text-sm text-slate-500 block mt-1">
                        {doc.departmentName}
                      </Text>
                      <Text className="text-sm text-slate-500 block mt-1">
                        擅长：{doc.specialty}
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#94A3B8" />
                  </CardContent>
                </Card>
              ))}
            </View>
          </TabsContent>

          {/* 按科室查看 */}
          <TabsContent value="departments" className="mt-3 mb-6">
            <View className="flex flex-col gap-3">
              {departments.map((dept) => {
                const deptDocs = doctors.filter((d) => d.departmentId === dept.id)
                return (
                  <Card
                    key={dept.id}
                    className="bg-white rounded-xl shadow-sm active:opacity-80"
                    onClick={() =>
                      Taro.navigateTo({
                        url: `/pages/hospital/department-detail?id=${dept.id}`,
                      })
                    }
                  >
                    <CardContent className="p-4">
                      <View className="flex flex-row items-center gap-3">
                        <View className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                          <Stethoscope size={20} color="#0D9488" />
                        </View>
                        <View className="flex-1">
                          <View className="flex flex-row items-center gap-2">
                            <Text className="text-base font-semibold text-slate-800 block">
                              {dept.name}
                            </Text>
                            <Badge
                              variant="secondary"
                              className="bg-slate-100 text-slate-600 border-0 text-xs"
                            >
                              {deptDocs.length}位医生
                            </Badge>
                          </View>
                          <Text className="text-sm text-slate-500 block mt-1">
                            {dept.location}
                          </Text>
                        </View>
                        <ChevronRight size={16} color="#94A3B8" />
                      </View>
                      {/* 科室医生预览 */}
                      <View className="mt-3 pt-3 border-t border-slate-100">
                        <View className="flex flex-row gap-2 flex-wrap">
                          {deptDocs.slice(0, 3).map((doc) => (
                            <View
                              key={doc.id}
                              className="bg-teal-50 px-3 py-1 rounded-full"
                            >
                              <Text className="text-xs text-teal-700 block">
                                {doc.name} · {doc.title}
                              </Text>
                            </View>
                          ))}
                          {deptDocs.length > 3 && (
                            <View className="bg-slate-50 px-3 py-1 rounded-full">
                              <Text className="text-xs text-slate-500 block">
                                +{deptDocs.length - 3}位
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                )
              })}
            </View>
          </TabsContent>
        </Tabs>
      </View>
    </ScrollView>
  )
}

export default HospitalPage
