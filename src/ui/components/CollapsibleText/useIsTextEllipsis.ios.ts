import { useCallback, useState } from 'react'
import { useTheme } from 'styled-components/native'

import { IsTextEllipsisOutput } from './types'

export const useIsTextEllipsis = (numberOfLines: number): IsTextEllipsisOutput => {
  const [isTextEllipsis, setIsTextEllipsis] = useState(false)
  const theme = useTheme()
  const lineHeight = Number(theme.typography.body.lineHeight.slice(0, -2))

  const onLayout: Required<IsTextEllipsisOutput>['onLayout'] = useCallback(
    (event) => {
      const textHeight = event.nativeEvent.layout.height
      const maxTextHeight = lineHeight * numberOfLines

      setIsTextEllipsis(textHeight >= maxTextHeight)
    },
    [lineHeight, numberOfLines]
  )
  return { isTextEllipsis, onLayout }
}
