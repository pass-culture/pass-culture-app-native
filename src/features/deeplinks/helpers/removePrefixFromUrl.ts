import { linking } from 'features/navigation/RootNavigator/linking'

export const removePrefixFromUrl = (urlWithPrefix: string) => {
  let pathWithQueryString = urlWithPrefix
  for (const prefix of linking.prefixes) {
    pathWithQueryString = pathWithQueryString.replace(prefix, '')
  }
  return pathWithQueryString
}
