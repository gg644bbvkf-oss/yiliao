export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '医生详情' })
  : { navigationBarTitleText: '医生详情' }
