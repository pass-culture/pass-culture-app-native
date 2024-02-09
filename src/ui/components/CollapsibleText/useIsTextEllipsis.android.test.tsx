import { NativeSyntheticEvent, TextLayoutEventData } from 'react-native'

import { act, renderHook } from 'tests/utils'
import { useIsTextEllipsis } from 'ui/components/CollapsibleText/useIsTextEllipsis.android'

describe('useIsTextEllipsis', () => {
  it('should return the text ends with ellipsis when the text takes more lines than the max', async () => {
    const numberOfLines = 2
    const { result } = renderHook(() => useIsTextEllipsis(numberOfLines))

    const threeLinesEvent = {
      nativeEvent: { lines: [{ width: 300 }, { width: 300 }, { width: 300 }] },
    } as NativeSyntheticEvent<TextLayoutEventData>
    await act(async () => {
      result.current.onTextLayout?.(threeLinesEvent)
    })

    expect(result.current).toEqual({ isTextEllipsis: true, onTextLayout: expect.any(Function) })
  })

  it("should return the text doesn't end with ellipsis when the text fits in the max number of lines", async () => {
    const numberOfLines = 2
    const { result } = renderHook(() => useIsTextEllipsis(numberOfLines))

    const twoLinesEvent = {
      nativeEvent: { lines: [{ width: 300 }, { width: 300 }] },
    } as NativeSyntheticEvent<TextLayoutEventData>
    await act(async () => {
      result.current.onTextLayout?.(twoLinesEvent)
    })

    expect(result.current).toEqual({ isTextEllipsis: false, onTextLayout: expect.any(Function) })
  })
})
