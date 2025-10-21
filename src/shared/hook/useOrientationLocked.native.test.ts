import AsyncStorage from '@react-native-async-storage/async-storage'
import Orientation from 'react-native-orientation-locker'

import { renderHook, waitFor } from 'tests/utils'

import { useOrientationLocked } from './useOrientationLocked'

jest.mock('@react-native-async-storage/async-storage')
jest.mock('react-native-orientation-locker')

describe('useOrientationLocked', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with unlocked orientation by default (no stored value)', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(null)

    const { result } = renderHook(() => useOrientationLocked())

    await waitFor(() => {
      const isOrientationLocked = result.current[0]

      expect(isOrientationLocked).toBe(false)
    })

    expect(Orientation.unlockAllOrientations).toHaveBeenCalledTimes(1)
  })

  it('should initialize with locked orientation if stored value is true', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce('true')
    jest.spyOn(Orientation, 'isLocked').mockReturnValueOnce(true)

    const { result } = renderHook(() => useOrientationLocked())

    await waitFor(() => {
      const isOrientationLocked = result.current[0]

      expect(isOrientationLocked).toBe(true)
    })

    expect(Orientation.lockToPortrait).toHaveBeenCalledTimes(1)
  })

  it('should initialize with unlocked orientation if stored value is false', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce('false')
    jest.spyOn(Orientation, 'isLocked').mockReturnValueOnce(false)

    const { result } = renderHook(() => useOrientationLocked())

    await waitFor(() => {
      const isOrientationLocked = result.current[0]

      expect(isOrientationLocked).toBe(false)
    })

    expect(Orientation.lockToPortrait).not.toHaveBeenCalled()
    expect(Orientation.unlockAllOrientations).toHaveBeenCalledTimes(1)
  })

  it('should lock orientation when toggling from unlocked state', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce('false')
    jest
      .spyOn(Orientation, 'isLocked')
      .mockReturnValueOnce(false) // Initial call
      .mockReturnValueOnce(false) // During toggleOrientation
      .mockReturnValueOnce(false) // After useEffect

    const { result } = renderHook(() => useOrientationLocked())
    const toggleOrientation = result.current[1]
    await toggleOrientation()

    expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(1, 'orientationLocked', 'true')
    expect(Orientation.lockToPortrait).toHaveBeenCalledTimes(1)
  })

  it('should unlock orientation when toggling from locked state', async () => {
    jest.spyOn(Orientation, 'isLocked').mockReturnValueOnce(true)
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce('true')

    const { result } = renderHook(() => useOrientationLocked())
    const toggleOrientation = result.current[1]
    await toggleOrientation()

    expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(1, 'orientationLocked', 'false')
    expect(Orientation.unlockAllOrientations).toHaveBeenCalledTimes(1)
  })

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(() => useOrientationLocked())
    unmount()

    expect(Orientation.removeAllListeners).toHaveBeenCalledTimes(1)
  })
})
