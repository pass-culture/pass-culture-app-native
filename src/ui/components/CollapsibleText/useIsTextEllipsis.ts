import { useCallback, useState } from 'react'
import { useTheme } from 'styled-components/native'

import { REM_TO_PX } from 'ui/theme/constants'

import { IsTextEllipsisOutput } from './types'

// React Native Web doesn't support onTextLayout
// https://github.com/necolas/react-native-web/issues/1685
export const useIsTextEllipsis = (numberOfLines: number): IsTextEllipsisOutput => {
  const [isTextEllipsis, setIsTextEllipsis] = useState(false)
  const theme = useTheme()

  const lineHeight = parseFloat(theme.designSystem.typography.body.lineHeight) * REM_TO_PX

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
