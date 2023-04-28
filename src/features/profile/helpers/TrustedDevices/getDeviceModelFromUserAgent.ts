import { Platform } from 'react-native'

const NO_DEVICE_MODEL_FOUND = 'Model inconnu'

const APPLE_DEVICES = /iPhone|iPad|iPod|Macintosh/

const ANDROID_DEVICES =
  /Android|Pixel|Samsung|LG|Motorola|OnePlus|HTC|Sony Xperia|Huawei|Xiaomi|Asus Zenfone/

const WINDOWS_DEVICES =
  /Windows Phone|Microsoft Surface|Dell XPS|HP Spectre|Acer Aspire|Asus VivoBook|Nokia Lumia|Microsoft Lumia/

const OTHER_DEVICES = /Amazon Kindle|BlackBerry|Lenovo Yoga|Chromebook/

const DEVICE_MODEL_REGEX = new RegExp(
  `${APPLE_DEVICES.source}|${ANDROID_DEVICES.source}|${WINDOWS_DEVICES.source}|${OTHER_DEVICES.source}`,
  'gi'
)

export const getDeviceModelFromUserAgent = (): string => {
  const isWeb = Platform.OS === 'web'
  if (!isWeb) return NO_DEVICE_MODEL_FOUND

  const matchModel = navigator.userAgent.match(DEVICE_MODEL_REGEX)
  if (matchModel) return matchModel[0].toString()
  return NO_DEVICE_MODEL_FOUND
}
