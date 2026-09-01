import { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  Building2,
  Stethoscope,
  BookOpen,
  Phone,
  ChevronRight,
  MapPin,
  Clock,
  CreditCard,
  Bus,
} from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  hospitalInfo,
  departments,
  doctors,
  visitingGuide,
} from '@/data/mock-data'

const HospitalPage = () => {
  const [activeTab, setActiveTab] = useState('about')

  const handleCallPhone = () => {
    Taro.makePhoneCall({ phoneNumber: hospitalInfo.phone })
  }

  const handleCallEmergency = () => {
    Taro.makePhoneCall({ phoneNumber: hospitalInfo.emergencyPhone })
  }

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      {/* 顶部医院信息 */}
      <View className="bg-teal-600 px-4 pt-4 pb-6">
        <View className="flex flex-row items-center gap-3">
          <View className="w-14 h-14 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
            <Building2 size={28} color="#0D9488" />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-white block">{hospitalInfo.name}</Text>
            <Text className="text-sm text-teal-100 block mt-1">
              守护您和家人的健康
            </Text>
          </View>
        </View>
      </View>

      {/* Tab 切换 */}
      <View className="px-4 -mt-3">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white rounded-xl shadow-sm h-auto p-1 w-full">
            <View className="flex flex-row w-full">
              <TabsTrigger
                value="about"
                className="flex-1 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg py-2"
              >
                <Text className="text-xs block">医院简介</Text>
              </TabsTrigger>
              <TabsTrigger
                value="departments"
                className="flex-1 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg py-2"
              >
                <Text className="text-xs block">科室</Text>
              </TabsTrigger>
              <TabsTrigger
                value="doctors"
                className="flex-1 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg py-2"
              >
                <Text className="text-xs block">医生</Text>
              </TabsTrigger>
              <TabsTrigger
                value="guide"
                className="flex-1 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg py-2"
              >
                <Text className="text-xs block">指南</Text>
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="flex-1 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg py-2"
              >
                <Text className="text-xs block">联系</Text>
              </TabsTrigger>
            </View>
          </TabsList>

          {/* 医院简介 */}
          <TabsContent value="about" className="mt-3">
            <Card className="bg-white rounded-xl shadow-sm">
              <CardContent className="p-4">
                <View className="flex flex-row items-center gap-2 mb-3">
                  <Building2 size={18} color="#0D9488" />
                  <Text className="text-lg font-bold text-slate-800 block">医院概况</Text>
                </View>
                <Text className="text-base text-slate-700 block leading-relaxed whitespace-pre-line">
                  {hospitalInfo.summary}
                </Text>

                <View className="mt-4 pt-3 border-t border-slate-100">
                  <Text className="text-base font-semibold text-slate-800 block mb-2">
                    服务范围
                  </Text>
                  <Text className="text-base text-slate-700 block leading-relaxed">
                    {hospitalInfo.serviceScope}
                  </Text>
                </View>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 科室介绍 */}
          <TabsContent value="departments" className="mt-3 mb-6">
            <View className="flex flex-col gap-3">
              {departments.map((dept) => (
                <Card
                  key={dept.id}
                  className="bg-white rounded-xl shadow-sm active:opacity-80"
                  onClick={() =>
                    Taro.navigateTo({
                      url: `/pages/hospital/department-detail?id=${dept.id}`,
                    })
                  }
                >
                  <CardContent className="p-4 flex flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <Stethoscope size={20} color="#0D9488" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-slate-800 block">
                        {dept.name}
                      </Text>
                      <Text className="text-sm text-slate-500 block mt-1">{dept.location}</Text>
                    </View>
                    <ChevronRight size={16} color="#94A3B8" />
                  </CardContent>
                </Card>
              ))}
            </View>
          </TabsContent>

          {/* 医生团队 */}
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

          {/* 就诊指南 */}
          <TabsContent value="guide" className="mt-3 mb-6">
            <View className="flex flex-col gap-3">
              <Card className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <View className="flex flex-row items-center gap-2 mb-2">
                    <Clock size={18} color="#0D9488" />
                    <Text className="text-base font-semibold text-slate-800 block">
                      门诊时间
                    </Text>
                  </View>
                  <Text className="text-base text-slate-700 block leading-relaxed whitespace-pre-line">
                    {visitingGuide.outpatientTime}
                  </Text>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <View className="flex flex-row items-center gap-2 mb-2">
                    <BookOpen size={18} color="#0D9488" />
                    <Text className="text-base font-semibold text-slate-800 block">
                      就诊流程
                    </Text>
                  </View>
                  <Text className="text-base text-slate-700 block leading-relaxed whitespace-pre-line">
                    {visitingGuide.process}
                  </Text>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <View className="flex flex-row items-center gap-2 mb-2">
                    <CreditCard size={18} color="#0D9488" />
                    <Text className="text-base font-semibold text-slate-800 block">
                      医保说明
                    </Text>
                  </View>
                  <Text className="text-base text-slate-700 block leading-relaxed whitespace-pre-line">
                    {visitingGuide.insurance}
                  </Text>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <View className="flex flex-row items-center gap-2 mb-2">
                    <Bus size={18} color="#0D9488" />
                    <Text className="text-base font-semibold text-slate-800 block">
                      交通指引
                    </Text>
                  </View>
                  <Text className="text-base text-slate-700 block leading-relaxed whitespace-pre-line">
                    {visitingGuide.transport}
                  </Text>
                </CardContent>
              </Card>
            </View>
          </TabsContent>

          {/* 联系我们 */}
          <TabsContent value="contact" className="mt-3 mb-6">
            <View className="flex flex-col gap-3">
              <Card className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <View className="flex flex-row items-center gap-3 mb-3">
                    <View className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <Phone size={20} color="#0D9488" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm text-slate-500 block">咨询电话</Text>
                      <Text className="text-xl font-bold text-teal-600 block mt-1">
                        {hospitalInfo.phone}
                      </Text>
                    </View>
                  </View>
                  <Button
                    className="w-full h-11 bg-teal-600 text-white rounded-xl"
                    onClick={handleCallPhone}
                  >
                    <Phone size={16} color="#ffffff" />
                    <Text className="text-base text-white block">一键拨打</Text>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 rounded-xl shadow-sm border border-orange-100">
                <CardContent className="p-4">
                  <View className="flex flex-row items-center gap-3 mb-3">
                    <View className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Phone size={20} color="#F97316" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm text-orange-600 block">急诊电话</Text>
                      <Text className="text-xl font-bold text-orange-600 block mt-1">
                        {hospitalInfo.emergencyPhone}
                      </Text>
                    </View>
                  </View>
                  <Button
                    className="w-full h-11 bg-orange-500 text-white rounded-xl"
                    onClick={handleCallEmergency}
                  >
                    <Phone size={16} color="#ffffff" />
                    <Text className="text-base text-white block">急诊拨打</Text>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <View className="flex flex-row items-center gap-2 mb-2">
                    <MapPin size={18} color="#0D9488" />
                    <Text className="text-base font-semibold text-slate-800 block">
                      医院地址
                    </Text>
                  </View>
                  <Text className="text-base text-slate-700 block">
                    {hospitalInfo.address}
                  </Text>
                  <Text className="text-sm text-slate-500 block mt-2">
                    导航搜索「{hospitalInfo.name}」即可到达
                  </Text>
                </CardContent>
              </Card>
            </View>
          </TabsContent>
        </Tabs>
      </View>
    </ScrollView>
  )
}

export default HospitalPage
