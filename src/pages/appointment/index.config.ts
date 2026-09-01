export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '预约挂号' })
  : { navigationBarTitleText: '预约挂号' }
