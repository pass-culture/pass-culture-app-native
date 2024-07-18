import AsyncStorage from '@react-native-async-storage/async-storage'

import { Attrakdiff } from './useAttrakdiffModal'

export const createAsyncStorageAttrakdiff = (key: string): Attrakdiff => {
  return {
    hasTriggered: async () => (await AsyncStorage.getItem(key)) === 'true',
    setTriggered: async () => {
      await AsyncStorage.setItem(key, 'true')
    },
  }
}
