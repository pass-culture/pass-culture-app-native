import { useCallback, useState } from 'react'
import { useTheme } from 'styled-components/native'

import { IsTextEllipsisOutput } from './types'

const REM_TO_PX = 16

// React Native Web doesn't support onTextLayout
// https://github.com/necolas/react-native-web/issues/1685
export const useIsTextEllipsis = (numberOfLines: number): IsTextEllipsisOutput => {
  const [isTextEllipsis, setIsTextEllipsis] = useState(false)
  const theme = useTheme()

  const lineHeight = Number(theme.designSystem.typography.body.lineHeight.slice(0, -3)) * REM_TO_PX

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
