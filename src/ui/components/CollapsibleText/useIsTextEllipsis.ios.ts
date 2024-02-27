import { useState } from 'react'

import { IsTextEllipsisOutput } from './types'

const ELLIPSIS_LENGTH = 10

// On iOS, onTextLayout doesn't return more text lines than numberOfLines.
// So we check if the last line is long enough, compared to the whole text width.
export const useIsTextEllipsis = (numberOfLines: number): IsTextEllipsisOutput => {
  const [textWidth, setTextWidth] = useState<number | undefined>(undefined)
  const [nthLineWidth, setNthLineWidth] = useState<number | undefined>(undefined)
  const isTextEllipsis =
    !!nthLineWidth && !!textWidth && nthLineWidth >= textWidth - ELLIPSIS_LENGTH

  const onTextLayout: Required<IsTextEllipsisOutput>['onTextLayout'] = (event) => {
    if (event.nativeEvent.lines.length === numberOfLines) {
      setNthLineWidth(event.nativeEvent.lines[numberOfLines - 1].width)
    }
  }

  const onLayout: Required<IsTextEllipsisOutput>['onLayout'] = (event) => {
    setTextWidth(event.nativeEvent.layout.width)
  }

  return {
    isTextEllipsis,
    onTextLayout,
    onLayout,
  }
}
