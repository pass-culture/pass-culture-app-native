import { removeGenerateCookieKey } from 'features/cookies/helpers/removeGenerateCookieKey'
import { storage, StorageKey } from 'libs/storage'
import { renderHook, superFlushWithAct } from 'tests/utils'

const key = 'traffic_medium'
const keyPrefix = 'algoliasearch-client-js' as StorageKey
const keyWithPrefix = keyPrefix.concat('-', '1234') as StorageKey // algoliasearch-client-js-1234
const keyWithPartialPrefix = keyPrefix.slice(0, keyPrefix.length / 2) as StorageKey // algoliasear
const someValue = 'some value'

describe('removeGenerateCookieKey', () => {
  it('should clear optional key', async () => {
    storage.saveObject(key, someValue)

    renderHook(() => removeGenerateCookieKey(key))

    await superFlushWithAct()
    expect(await storage.getAllKeys()).toEqual([])
  })

  it('should clear optional key with prefix', async () => {
    storage.saveObject(keyWithPrefix, someValue)

    renderHook(() => removeGenerateCookieKey(keyPrefix))

    await superFlushWithAct()
    expect(await storage.getAllKeys()).toEqual([])
  })

  it('should not clear optional key with partial prefix', async () => {
    storage.saveObject(keyWithPartialPrefix, someValue)

    renderHook(() => removeGenerateCookieKey(keyPrefix))

    await superFlushWithAct()
    expect(await storage.getAllKeys()).toEqual([keyWithPartialPrefix])
  })
})
