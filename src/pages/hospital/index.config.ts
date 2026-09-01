export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '医生介绍' })
  : { navigationBarTitleText: '医生介绍' }
