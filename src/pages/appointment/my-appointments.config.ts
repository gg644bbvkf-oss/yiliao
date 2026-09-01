export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '我的预约' })
  : { navigationBarTitleText: '我的预约' }
