import { linking } from 'features/navigation/RootNavigator/linking'

export const isAppUrl = (url: string) => {
  for (const prefix of linking.prefixes) {
    if (RegExp(`^${prefix}`).exec(url)) {
      return true
    }
  }
  return false
}
