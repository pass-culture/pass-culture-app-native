import { Animated } from 'react-native'

import { renderHook } from 'tests/utils'

import { HEIGHT_END_OF_TRANSITION, useScrollToBottomOpacity } from './useScrollToBottomOpacity'

/**
 * Since Animated library does not expose __getValue publicly,
 * I add a custom type to make it work for testing purposes.
 */
type AnimatedValueHack = { __getValue: () => number }

function getHackedValue(opacity: Animated.AnimatedInterpolation<number>) {
  return (opacity as unknown as AnimatedValueHack).__getValue()
}

describe('useScrollToBottomOpacity', () => {
  it('should return opacity at 0 by default', () => {
    const { result } = renderHook(useScrollToBottomOpacity)

    expect(getHackedValue(result.current.opacity)).toEqual(0)
  })

  it('should return 1 when scrolling to max offset', () => {
    const { result } = renderHook(useScrollToBottomOpacity)

    result.current.handleScroll({ scrollOffset: HEIGHT_END_OF_TRANSITION })

    expect(getHackedValue(result.current.opacity)).toEqual(1)
  })

  it('should return 1 when scrolling far away from top', () => {
    const { result } = renderHook(useScrollToBottomOpacity)

    result.current.handleScroll({ scrollOffset: 2000 })

    expect(getHackedValue(result.current.opacity)).toEqual(1)
  })

  it('should return 0.5 when middle of transition', () => {
    const { result } = renderHook(useScrollToBottomOpacity)

    result.current.handleScroll({ scrollOffset: HEIGHT_END_OF_TRANSITION / 2 })

    expect(getHackedValue(result.current.opacity)).toEqual(0.5)
  })
})
