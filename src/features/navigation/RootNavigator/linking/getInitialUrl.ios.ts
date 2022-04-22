import { Linking } from 'react-native'

export async function getInitialURL(): Promise<string | null> {
  return Linking.getInitialURL()
}
