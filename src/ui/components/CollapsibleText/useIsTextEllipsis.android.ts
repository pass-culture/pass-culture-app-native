import { useCallback, useState } from 'react'

import { IsTextEllipsisOutput } from './types'

// On Android, onTextLayout returns the number of text lines without numberOfLines.
// So we can check if the number of lines is greater than numberOfLines.
export const useIsTextEllipsis = (numberOfLines: number): IsTextEllipsisOutput => {
  const [isTextEllipsis, setIsTextEllipsis] = useState(false)

  const onTextLayout: Required<IsTextEllipsisOutput>['onTextLayout'] = useCallback(
    (event) => {
      const linesWidth = event.nativeEvent.lines.map((line) => line.width)

      if (linesWidth.length > numberOfLines) {
        setIsTextEllipsis(true)
      }
    },
    [numberOfLines]
  )
  return { isTextEllipsis, onTextLayout }
}
