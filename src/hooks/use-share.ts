import { useShareAppMessage, useShareTimeline } from '@tarojs/taro'

interface ShareOptions {
  title?: string
  path?: string
  imageUrl?: string
}

const DEFAULT_TITLE = '旬邑县城关镇卫生院 · 在线预约'
const DEFAULT_PATH = '/pages/index/index'

/**
 * 统一开启页面的「转发给朋友」与「分享到朋友圈」能力。
 * 在任意页面组件顶层调用一次即可。
 */
export default function useShare(options: ShareOptions = {}) {
  const { title = DEFAULT_TITLE, path = DEFAULT_PATH, imageUrl } = options

  useShareAppMessage(() => ({
    title,
    path,
    ...(imageUrl ? { imageUrl } : {}),
  }))

  useShareTimeline(() => ({
    title,
    query: '',
    ...(imageUrl ? { imageUrl } : {}),
  }))
}
