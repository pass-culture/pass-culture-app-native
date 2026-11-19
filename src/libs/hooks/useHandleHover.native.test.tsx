import React, { PropsWithChildren } from 'react'

import { useHandleHover } from 'libs/hooks/useHandleHover'
import { ThemeProvider } from 'libs/styled'
import { ColorScheme } from 'libs/styled/useColorScheme'
import { computedTheme } from 'tests/computedTheme'
import { act, renderHook } from 'tests/utils'

const renderUseHandleHover = (isTouch: boolean) => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <ThemeProvider theme={{ ...computedTheme, isTouch }} colorScheme={ColorScheme.LIGHT}>
      {children}
    </ThemeProvider>
  )
  return renderHook(useHandleHover, { wrapper })
}

describe('useHandleHover', () => {
  it('should set hover on mouse enter when device is not touch', () => {
    const { result } = renderUseHandleHover(false)

    act(() => result.current.onMouseEnter())

    expect(result.current.isHover).toBe(true)
  })

  it('should reset hover on mouse leave', () => {
    const { result } = renderUseHandleHover(false)

    act(() => result.current.onMouseEnter())
    act(() => result.current.onMouseLeave())

    expect(result.current.isHover).toBe(false)
  })

  it('should not set hover on mouse enter when device is touch', () => {
    const { result } = renderUseHandleHover(true)

    act(() => result.current.onMouseEnter())

    expect(result.current.isHover).toBe(false)
  })
})
