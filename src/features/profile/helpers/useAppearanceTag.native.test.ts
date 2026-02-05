import AsyncStorage from '@react-native-async-storage/async-storage'

import { act, renderHook, waitFor } from 'tests/utils'

import { useAppearanceTag } from './useAppearanceTag'

const KEY = 'darkModeGtmAppearanceTagSeen'

describe('useAppearanceTag', () => {
  beforeEach(() => jest.resetAllMocks())

  it('should set hasSeenAppearanceTag to null if enableDarkModeGtm is false', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce('true')

    const { result } = renderHook(() => useAppearanceTag(false))

    await waitFor(() => {
      expect(result.current.hasSeenAppearanceTag).toBeNull()
      expect(AsyncStorage.getItem).not.toHaveBeenCalled()
    })
  })

  it('should read AsyncStorage and set hasSeenAppearanceTag to true if stored value is "true"', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce('true')

    const { result } = renderHook(() => useAppearanceTag(true))

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(KEY)
      expect(result.current.hasSeenAppearanceTag).toBe(true)
    })
  })

  it('should read AsyncStorage and set hasSeenAppearanceTag to false if stored value is "false"', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce('false')

    const { result } = renderHook(() => useAppearanceTag(true))

    await waitFor(() => {
      expect(result.current.hasSeenAppearanceTag).toBe(false)
    })
  })

  it('should set hasSeenAppearanceTag to false if nothing stored', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(null)

    const { result } = renderHook(() => useAppearanceTag(true))

    await waitFor(() => {
      expect(result.current.hasSeenAppearanceTag).toBe(false)
    })
  })

  it('should update hasSeenAppearanceTag and AsyncStorage on markAppearanceTagSeen call', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useAppearanceTag(true))

    act(() => result.current.markAppearanceTagSeen())

    await waitFor(() => {
      expect(result.current.hasSeenAppearanceTag).toBe(true)
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(KEY, 'true')
    })
  })

  it('should handle AsyncStorage.setItem rejection silently', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('fail'))

    const { result } = renderHook(() => useAppearanceTag(true))

    act(() => result.current.markAppearanceTagSeen())

    await waitFor(() => {
      expect(result.current.hasSeenAppearanceTag).toBe(true)
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(KEY, 'true')
    })
  })
})
