import { removeGeneratedStorageKey } from 'features/cookies/helpers/removeGeneratedStorageKey'
import { storage, StorageKey } from 'libs/storage'
import { act } from 'tests/utils'

const someValue = 'some value'
const keyColorScheme = 'colorScheme'

describe('removeGeneratedStorageKey', () => {
  it('should clear optional key', async () => {
    const key = 'traffic_medium'
    storage.saveObject(key, someValue)

    await act(async () => {
      removeGeneratedStorageKey(key)
    })

    expect(await storage.getAllKeys()).toEqual([keyColorScheme])
  })

  it('should clear optional key with prefix', async () => {
    const keyWithPrefix = 'algoliasearch-client-js-1234' as StorageKey
    storage.saveObject(keyWithPrefix, someValue)

    const prefix = 'algoliasearch-client-js' as StorageKey
    await act(async () => {
      removeGeneratedStorageKey(prefix)
    })

    expect(await storage.getAllKeys()).toEqual([keyColorScheme])
  })

  it('should not clear optional key with partial prefix', async () => {
    const keyWithPartialPrefix = 'algoliasear' as StorageKey

    storage.saveObject(keyWithPartialPrefix, someValue)

    const prefix = 'algoliasearch-client-js' as StorageKey
    await act(async () => {
      removeGeneratedStorageKey(prefix)
    })

    expect(await storage.getAllKeys()).toEqual([keyColorScheme, keyWithPartialPrefix])
  })
})
