import { linking } from 'features/navigation/RootNavigator/linking'

export const isAppUrl = (url: string) => {
  for (const prefix of linking.prefixes) {
    if (url.match('^' + prefix)) {
      return true
    }
  }
  return false
}
