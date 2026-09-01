export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '医院简介' })
  : { navigationBarTitleText: '医院简介' }
