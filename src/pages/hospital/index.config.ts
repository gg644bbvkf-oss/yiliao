export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '医院介绍' })
  : { navigationBarTitleText: '医院介绍' }
