import Taro from '@tarojs/taro';

/**
 * 小程序调试工具（已停用自动开启调试）
 * 避免在开发版/体验版自动注入 vConsole 调试图标
 */
export function devDebug() {
  const env = Taro.getEnv();
  if (env === Taro.ENV_TYPE.WEAPP) {
    try {
      const accountInfo = Taro.getAccountInfoSync();
      const envVersion = accountInfo.miniProgram.envVersion;
      console.log('[Debug] envVersion:', envVersion);
    } catch (error) {
      console.error('[Debug] 获取环境信息失败:', error);
    }
  }
}
