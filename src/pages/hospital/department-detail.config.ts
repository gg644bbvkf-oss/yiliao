export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '科室详情' })
  : { navigationBarTitleText: '科室详情' }
