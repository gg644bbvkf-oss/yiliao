import { View, Text, Image } from '@tarojs/components'

const CM_LOGO =
  'https://coze-coding-project.tos.coze.site/coze_storage_7680476130855649315/image/generate_image_251ca81d-771c-4024-8b3d-ad1940092243.jpeg?sign=1821618536-63d3dae136-0-aec23f8c4b39f3cb80752b5ae0b2097915a052ae03f9588d5e75cd55a959a732'

export default function SupportFooter({ withTabBar = false }: { withTabBar?: boolean }) {
  return (
    <View
      className="w-full flex flex-col items-center justify-center"
      style={{
        paddingTop: 16,
        paddingBottom: withTabBar ? 66 : 20,
        backgroundColor: 'transparent',
      }}
    >
      <View className="flex flex-row items-center justify-center">
        <Image
          src={CM_LOGO}
          mode="aspectFit"
          style={{ width: 22, height: 22, marginRight: 6 }}
        />
        <Text className="block text-xs text-slate-400">本小程序由旬邑移动提供技术支持</Text>
      </View>
    </View>
  )
}