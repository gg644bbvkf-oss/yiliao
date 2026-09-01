export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '填写预约信息' })
  : { navigationBarTitleText: '填写预约信息' }
