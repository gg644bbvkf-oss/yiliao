export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '就诊人管理' })
  : { navigationBarTitleText: '就诊人管理' }
