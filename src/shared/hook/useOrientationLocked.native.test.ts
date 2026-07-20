import AsyncStorage from '@react-native-async-storage/async-storage'
import Orientation from 'react-native-orientation-locker'

import { act, renderHook, waitFor } from 'tests/utils'

import { useOrientationLocked } from './useOrientationLocked'

const storage: Record<string, string> = {}

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key: string) => Promise.resolve(storage[key] ?? null)),
  setItem: jest.fn((key: string, value: string) => {
    storage[key] = value
    return Promise.resolve()
  }),
}))

jest.mock('react-native-orientation-locker', () => ({
  lockToPortrait: jest.fn(),
  unlockAllOrientations: jest.fn(),
  getAutoRotateState: jest.fn((callback: (state: boolean) => void) => callback(true)),

  addOrientationListener: jest.fn(),
  removeOrientationListener: jest.fn(),

  addLockListener: jest.fn(),
  removeLockListener: jest.fn(),
}))

describe('useOrientationLocked', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.keys(storage).forEach((k) => delete storage[k])
  })

  it('should initialize with unlocked orientation by default', async () => {
    renderHook(() => useOrientationLocked())

    await waitFor(() => {
      expect(Orientation.unlockAllOrientations).toHaveBeenCalledTimes(1)
    })
  })

  it('should initialize with locked orientation if stored value is true', async () => {
    storage.orientationLocked = 'true'

    renderHook(() => useOrientationLocked())

    await waitFor(() => {
      expect(Orientation.lockToPortrait).toHaveBeenCalledTimes(1)
    })
  })

  it('should initialize with unlocked orientation if stored value is false', async () => {
    storage.orientationLocked = 'false'

    renderHook(() => useOrientationLocked())

    await waitFor(() => {
      expect(Orientation.unlockAllOrientations).toHaveBeenCalledTimes(1)
    })
  })

  it('should lock orientation when toggling from unlocked state', async () => {
    storage.orientationLocked = 'false'

    const { result } = renderHook(() => useOrientationLocked())

    await act(async () => {
      await result.current[1]()
    })

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('orientationLocked', 'true')

    expect(Orientation.lockToPortrait).toHaveBeenCalledTimes(2) // 1 for initial unlock, 1 for toggle
  })

  it('should unlock orientation when toggling from locked state', async () => {
    storage.orientationLocked = 'true'

    const { result } = renderHook(() => useOrientationLocked())

    await waitFor(() => {
      expect(result.current[0]).toBe(true)
    })

    await act(async () => {
      await result.current[1]()
    })

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('orientationLocked', 'false')

    expect(Orientation.unlockAllOrientations).toHaveBeenCalledTimes(1)
  })

  it('should keep portrait when app allows rotation but system auto-rotate is disabled', async () => {
    ;(Orientation.getAutoRotateState as jest.Mock).mockImplementationOnce(
      (callback: (state: boolean) => void) => callback(false)
    )

    storage.orientationLocked = 'false'

    renderHook(() => useOrientationLocked())

    await waitFor(() => {
      expect(Orientation.lockToPortrait).toHaveBeenCalledTimes(1)
    })

    expect(Orientation.unlockAllOrientations).not.toHaveBeenCalled()
  })

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(() => useOrientationLocked())

    unmount()

    expect(Orientation.removeOrientationListener).toHaveBeenCalledTimes(1)
  })
})
