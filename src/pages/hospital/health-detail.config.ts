export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '健康宣传' })
  : { navigationBarTitleText: '健康宣传' }
