import { Platform } from 'react-native'

const NO_DEVICE_MODEL_FOUND = 'Model inconnu'
const DEVICE_MODEL_REGEX =
  /(iPhone|iPad|iPod|Macintosh|Android|Pixel|Samsung|Google|LG|Motorola|OnePlus|HTC|Sony Xperia|Huawei|Xiaomi|Asus Zenfone|Microsoft Surface|Amazon Kindle|BlackBerry|Nokia Lumia|Windows Phone|Microsoft Lumia|Lenovo Yoga|Dell XPS|HP Spectre|Acer Aspire|Asus VivoBook|Chromebook)/gi

export const getDeviceModelFromUserAgent = (): string => {
  const isWeb = Platform.OS === 'web'
  if (!isWeb) return NO_DEVICE_MODEL_FOUND

  const matchModel = navigator.userAgent.match(DEVICE_MODEL_REGEX)
  if (matchModel) return matchModel[0].toString()
  return NO_DEVICE_MODEL_FOUND
}
