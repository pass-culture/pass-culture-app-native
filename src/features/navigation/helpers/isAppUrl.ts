import { linkingPrefixes } from 'features/navigation/RootNavigator/linking/linkingPrefixes'

export const isAppUrl = (url: string) => {
  for (const prefix of linkingPrefixes) {
    if (url.match('^' + prefix)) {
      return true
    }
  }
  return false
}
