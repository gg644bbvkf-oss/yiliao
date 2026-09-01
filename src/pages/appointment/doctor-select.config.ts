export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '选择医生' })
  : { navigationBarTitleText: '选择医生' }
