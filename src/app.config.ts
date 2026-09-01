export default typeof defineAppConfig === 'function'
  ? defineAppConfig({
    pages: [
      'pages/index/index',
      'pages/appointment/index',
      'pages/hospital/index',
      'pages/profile/index',
      'pages/appointment/doctor-select',
      'pages/appointment/booking-form',
      'pages/appointment/booking-result',
      'pages/appointment/my-appointments',
      'pages/hospital/department-detail',
      'pages/hospital/doctor-detail',
      'pages/profile/patient-manage',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#0D9488',
      navigationBarTitleText: '旬邑县城关镇卫生院',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      color: '#64748B',
      selectedColor: '#0D9488',
      backgroundColor: '#ffffff',
      borderStyle: 'black',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '医院简介',
          iconPath: './assets/tabbar/building.png',
          selectedIconPath: './assets/tabbar/building-active.png',
        },
        {
          pagePath: 'pages/hospital/index',
          text: '医生介绍',
          iconPath: './assets/tabbar/stethoscope.png',
          selectedIconPath: './assets/tabbar/stethoscope-active.png',
        },
        {
          pagePath: 'pages/appointment/index',
          text: '预约挂号',
          iconPath: './assets/tabbar/calendar-plus.png',
          selectedIconPath: './assets/tabbar/calendar-plus-active.png',
        },
        {
          pagePath: 'pages/profile/index',
          text: '我的',
          iconPath: './assets/tabbar/user.png',
          selectedIconPath: './assets/tabbar/user-active.png',
        }
      ]
    }
  })
  : {
    pages: [
      'pages/index/index',
      'pages/appointment/index',
      'pages/hospital/index',
      'pages/profile/index',
      'pages/appointment/doctor-select',
      'pages/appointment/booking-form',
      'pages/appointment/booking-result',
      'pages/appointment/my-appointments',
      'pages/hospital/department-detail',
      'pages/hospital/doctor-detail',
      'pages/profile/patient-manage',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#0D9488',
      navigationBarTitleText: '旬邑县城关镇卫生院',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      color: '#64748B',
      selectedColor: '#0D9488',
      backgroundColor: '#ffffff',
      borderStyle: 'black',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '医院简介',
          iconPath: './assets/tabbar/building.png',
          selectedIconPath: './assets/tabbar/building-active.png',
        },
        {
          pagePath: 'pages/hospital/index',
          text: '医生介绍',
          iconPath: './assets/tabbar/stethoscope.png',
          selectedIconPath: './assets/tabbar/stethoscope-active.png',
        },
        {
          pagePath: 'pages/appointment/index',
          text: '预约挂号',
          iconPath: './assets/tabbar/calendar-plus.png',
          selectedIconPath: './assets/tabbar/calendar-plus-active.png',
        },
        {
          pagePath: 'pages/profile/index',
          text: '我的',
          iconPath: './assets/tabbar/user.png',
          selectedIconPath: './assets/tabbar/user-active.png',
        }
      ]
    }
  }
