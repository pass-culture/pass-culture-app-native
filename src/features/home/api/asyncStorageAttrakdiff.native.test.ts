import AsyncStorage from '@react-native-async-storage/async-storage'

import { createAsyncStorageAttrakdiff } from './asyncStorageAttrakdiff'

const KEY = 'hasTriggerAttrakdiff'

describe('AsyncStorageAttrakdiff', () => {
  beforeEach(async () => {
    await AsyncStorage.removeItem(KEY)
  })

  it('should return true when hasTriggered is true', async () => {
    const attrakdiff = createAsyncStorageAttrakdiff(KEY)

    await AsyncStorage.setItem(KEY, 'true')

    expect(await attrakdiff.hasTriggered()).toBe(true)
  })

  it('should set hasTrigged to true when setTrigger is called', async () => {
    const attrakdiff = createAsyncStorageAttrakdiff(KEY)

    await attrakdiff.setTriggered()

    expect(await AsyncStorage.getItem(KEY)).toBe('true')
  })
})
