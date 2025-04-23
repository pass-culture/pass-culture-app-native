import { Appearance, ColorSchemeName } from 'react-native'

import { colorSchemeActions, useColorScheme } from 'libs/styled/useColorScheme'
import { act, renderHook } from 'tests/utils'

const mockCurrentColorScheme = jest.fn((): ColorSchemeName => 'light')

jest.mock('react-native/Libraries/Utilities/Appearance', () => {
  let mockListenerColorScheme = jest.fn()
  return {
    getColorScheme: jest.fn(() => mockCurrentColorScheme()),
    addChangeListener: (listener) => {
      mockListenerColorScheme = listener
    },
    setColorScheme: (colorScheme) => {
      mockCurrentColorScheme.mockReturnValue(colorScheme)
      mockListenerColorScheme({ colorScheme })
    },
  }
})

describe('colorSchemeStore', () => {
  beforeEach(() => {
    mockCurrentColorScheme.mockReset()
  })

  it('should initialize with system colorScheme default (light)', () => {
    const { result } = renderHook(() => useColorScheme())

    expect(result.current).toBe('light')
  })

  it('should initialize with system colorScheme when is available', () => {
    mockCurrentColorScheme.mockReturnValueOnce('dark')
    colorSchemeActions.init()
    const { result } = renderHook(() => useColorScheme())

    expect(result.current).toBe('dark')
  })

  it.each([null, undefined])(
    'should default to light theme if no color scheme is detected (%s)',
    (value) => {
      mockCurrentColorScheme.mockReturnValueOnce(value)
      colorSchemeActions.init()
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe('light')
    }
  )

  it('should react to system color scheme change', async () => {
    colorSchemeActions.init()
    const { result } = renderHook(() => useColorScheme())

    expect(result.current).toBe('light')

    await act(async () => {
      Appearance.setColorScheme('dark')
    })

    expect(result.current).toBe('dark')
  })

  it.each([null, undefined])(
    'should default to light theme when system color scheme becomes unavailable (%s)',
    async (value) => {
      colorSchemeActions.init()
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe('light')

      await act(async () => {
        Appearance.setColorScheme(value)
      })

      expect(result.current).toBe('light')
    }
  )
})
