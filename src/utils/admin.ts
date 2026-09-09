import Taro from '@tarojs/taro'

const ADMIN_KEY = 'hospital_admin_cred'

export interface AdminCred {
  phone: string
  password: string
}

export function saveAdmin(cred: AdminCred) {
  try {
    Taro.setStorageSync(ADMIN_KEY, cred)
  } catch {
    /* ignore */
  }
}

export function getAdmin(): AdminCred | null {
  try {
    const v = Taro.getStorageSync(ADMIN_KEY)
    return v && v.phone ? v : null
  } catch {
    return null
  }
}

export function clearAdmin() {
  try {
    Taro.removeStorageSync(ADMIN_KEY)
  } catch {
    /* ignore */
  }
}

// 管理接口统一鉴权头
export function adminHeaders(): Record<string, string> {
  const cred = getAdmin()
  if (!cred) return {}
  return {
    'x-admin-phone': cred.phone,
    'x-admin-password': cred.password,
  }
}

// 便捷别名（供 admin-mgmt 登录态判断与保存使用）
export function getAdminToken(): boolean {
  return !!getAdmin()
}

export function setAdminInfo(phone: string, password: string) {
  saveAdmin({ phone, password })
}