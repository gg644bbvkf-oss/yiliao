export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '在线预约' })
  : { navigationBarTitleText: '在线预约' }
