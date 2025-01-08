import React from 'react'
import { LayoutChangeEvent } from 'react-native'
import { ThemeProvider } from 'styled-components/native'

import { computedTheme } from 'tests/computedTheme'
import { act, renderHook } from 'tests/utils/web'
import { useIsTextEllipsis } from 'ui/components/CollapsibleText/useIsTextEllipsis'
import { REM_TO_PX } from 'ui/theme/constants'

const LINE_HEIGHT = parseFloat(computedTheme.designSystem.typography.body.lineHeight) * REM_TO_PX

describe('useIsTextEllipsis', () => {
  it('should return the text ends with ellipsis when the text takes more lines than the max', async () => {
    const numberOfLines = 2
    const { result } = renderHook(() => useIsTextEllipsis(numberOfLines), {
      wrapper: ({ children }) => <ThemeProvider theme={computedTheme}>{children}</ThemeProvider>,
    })

    const threeLinesEvent = {
      nativeEvent: { layout: { x: 0, y: 0, height: LINE_HEIGHT * 3, width: 300 } },
    } as LayoutChangeEvent
    await act(async () => {
      result.current.onLayout?.(threeLinesEvent)
    })

    expect(result.current).toEqual({ isTextEllipsis: true, onLayout: expect.any(Function) })
  })

  it("should return the text doesn't end with ellipsis when the text is one line", async () => {
    const numberOfLines = 2
    const { result } = renderHook(() => useIsTextEllipsis(numberOfLines), {
      wrapper: ({ children }) => <ThemeProvider theme={computedTheme}>{children}</ThemeProvider>,
    })

    const oneLineEvent = {
      nativeEvent: { layout: { x: 0, y: 0, height: LINE_HEIGHT * 1, width: 300 } },
    } as LayoutChangeEvent
    await act(async () => {
      result.current.onLayout?.(oneLineEvent)
    })

    expect(result.current).toEqual({ isTextEllipsis: false, onLayout: expect.any(Function) })
  })
})
