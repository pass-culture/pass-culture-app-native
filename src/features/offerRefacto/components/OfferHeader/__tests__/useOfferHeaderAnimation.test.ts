import React, { PropsWithChildren } from 'react'
import { Animated } from 'react-native'
import { ThemeProvider } from 'styled-components/native'

import { computedTheme } from 'tests/computedTheme'
import { renderHook } from 'tests/utils'

import { useOfferHeaderAnimation } from '../useOfferHeaderAnimation'

jest.mock('libs/firebase/analytics/analytics')

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

const wrapper = ({ children }: PropsWithChildren) =>
  React.createElement(ThemeProvider, { theme: computedTheme }, children)

describe('useOfferHeaderAnimation', () => {
  it('should return an animation state object', () => {
    const headerTransition = new Animated.Value(0) as Animated.AnimatedInterpolation<
      string | number
    >

    const { result } = renderHook(() => useOfferHeaderAnimation(headerTransition), { wrapper })

    expect(result.current).toBeDefined()
    expect(result.current.iconBackgroundColor).toBeDefined()
    expect(result.current.iconBorderColor).toBeDefined()
    expect(result.current.transition).toBeDefined()
  })

  it('should return the same transition as the input headerTransition', () => {
    const headerTransition = new Animated.Value(0) as Animated.AnimatedInterpolation<
      string | number
    >

    const { result } = renderHook(() => useOfferHeaderAnimation(headerTransition), { wrapper })

    expect(result.current.transition).toBe(headerTransition)
  })

  it('should return animated interpolation values for icon colors', () => {
    const headerTransition = new Animated.Value(0) as Animated.AnimatedInterpolation<
      string | number
    >

    const { result } = renderHook(() => useOfferHeaderAnimation(headerTransition), { wrapper })

    expect(result.current.iconBackgroundColor).toHaveProperty('interpolate')
    expect(result.current.iconBorderColor).toHaveProperty('interpolate')
  })
})
