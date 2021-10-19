import { linking } from 'features/navigation/RootNavigator/linking'

export const isAppUrl = (url: string) => {
  let isUrl = false
  for (const prefix of linking.prefixes) {
    if (url.match('^' + prefix)) {
      isUrl = true
    }
  }
  return isUrl
}
