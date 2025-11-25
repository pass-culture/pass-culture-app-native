import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { BatchPush } from 'libs/react-native-batch'

export async function getInitialURL(): Promise<string> {
  const url = await BatchPush.getInitialURL()
  if (url) {
    return url
  }
  return WEBAPP_V2_URL
}
