import { useEffect, useState } from 'react'
import SupportFooter from '@/components/support-footer'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { fetchRollingNews, type RollingNewsItem } from '@/services/content'

const HealthDetailPage = () => {
  const router = useRouter()
  const newsId = router.params.id || ''
  const [item, setItem] = useState<RollingNewsItem | null>(null)

  useEffect(() => {
    let mounted = true
    fetchRollingNews().then((list) => {
      if (!mounted) return
      const found = list.find((n) => n.id === newsId) || null
      setItem(found)
    })
    return () => {
      mounted = false
    }
  }, [newsId])

  const firstLine =
    (item?.content || '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)[0] || '健康宣传'

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      <View className="px-4 pt-4">
        <Card className="bg-white rounded-2xl shadow-sm">
          <CardContent className="p-5">
            <Text className="block text-lg font-bold text-slate-800 mb-3">
              {firstLine}
            </Text>
            <Text
              className="block leading-relaxed whitespace-pre-line"
              style={{
                fontSize: item?.fontSize ? `${item.fontSize}px` : '14px',
                color: item?.color || '#374151',
              }}
            >
              {item?.content || '内容加载中...'}
            </Text>
          </CardContent>
        </Card>
      </View>

      <View className="px-4 mt-4">
        <View
          className="w-full rounded-xl bg-white border border-slate-200 py-3 text-center"
          onClick={() => Taro.navigateBack()}
        >
          <Text className="block text-sm text-teal-600">返回上一页</Text>
        </View>
      </View>

      <SupportFooter />
    </ScrollView>
  )
}

export default HealthDetailPage
