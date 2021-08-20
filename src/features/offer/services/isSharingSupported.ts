import { Platform } from 'react-native'

export function isSharingSupported() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return true
  }
  if (Platform.OS === 'web') {
    // We use the same condition as react-native-web as we rely only on its
    // API for the moment : https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/Share/index.js#L33
    // TODO WEB : https://passculture.atlassian.net/browse/PC-10510
    return window && window.navigator && window.navigator.share
  }
  return false
}
