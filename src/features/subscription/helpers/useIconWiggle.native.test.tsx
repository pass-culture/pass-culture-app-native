jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'))

import { useIconWiggle } from 'features/subscription/helpers/useIconWiggle'
import { renderHook } from 'tests/utils'

describe('useIconWiggle', () => {
  it('should expose an animated style and a trigger function', () => {
    const { result } = renderHook(useIconWiggle)

    expect(result.current.iconAnimatedStyle).toEqual(
      expect.objectContaining({ transform: expect.any(Array) })
    )
    expect(typeof result.current.trigger).toBe('function')
  })

  it('should not throw when triggering the animation', () => {
    const { result } = renderHook(useIconWiggle)

    expect(() => result.current.trigger()).not.toThrow()
  })
})
