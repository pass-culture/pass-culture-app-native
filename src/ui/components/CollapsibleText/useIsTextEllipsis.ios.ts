import { useCallback, useRef, useState } from 'react'

import { IsTextEllipsisOutput } from './types'

const ELLIPSIS_LENGTH = 10

// On iOS, onTextLayout doesn't return more text lines than numberOfLines.
// So we check if the last line is long enough, compared to the whole text width.
export const useIsTextEllipsis = (numberOfLines: number): IsTextEllipsisOutput => {
  const textWidth = useRef<number | undefined>(undefined)
  const [isTextEllipsis, setIsTextEllipsis] = useState(false)

  const onTextLayout: Required<IsTextEllipsisOutput>['onTextLayout'] = useCallback(
    (event) => {
      const linesWidth = event.nativeEvent.lines.map((line) => line.width)
      if (linesWidth.length === numberOfLines && textWidth.current !== undefined) {
        setIsTextEllipsis(linesWidth[linesWidth.length - 1] >= textWidth.current - ELLIPSIS_LENGTH)
      }
    },
    [numberOfLines]
  )

  const onLayout: Required<IsTextEllipsisOutput>['onLayout'] = useCallback((event) => {
    textWidth.current = event.nativeEvent.layout.width
  }, [])

  return { isTextEllipsis, onTextLayout, onLayout }
}
