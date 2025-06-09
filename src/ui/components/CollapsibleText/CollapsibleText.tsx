import React, { FunctionComponent, PropsWithChildren, useState } from 'react'
import { LayoutChangeEvent, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { CollapsibleTextButton } from 'ui/components/CollapsibleText/CollapsibleTextButton/CollapsibleTextButton'
import { Typo } from 'ui/theme'
import { REM_TO_PX } from 'ui/theme/constants'

type Props = {
  collapsedLineCount: number
} & PropsWithChildren

// On Android, a 1px height difference is common due to text rendering (e.g., Skia, rounding, or lineHeight adjustments).
// We allow a small tolerance to avoid false positives.
const HEIGHT_TOLERANCE = Platform.OS === 'android' ? 2 : 0

export const CollapsibleText: FunctionComponent<Props> = ({ collapsedLineCount, children }) => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  const [currentNumberOfLines, setCurrentNumberOfLines] = useState<number | undefined>(undefined)
  const [shouldDisplayButton, setShouldDisplayButton] = useState(false)

  // height depending on the platform
  const DEFAULT_HEIGHT_WEB =
    parseFloat(theme.designSystem.typography.body.lineHeight) * collapsedLineCount * REM_TO_PX
  const DEFAULT_HEIGHT_MOBILE =
    parseFloat(theme.designSystem.typography.body.lineHeight) * collapsedLineCount
  const defaultHeight = Platform.OS === 'web' ? DEFAULT_HEIGHT_WEB : DEFAULT_HEIGHT_MOBILE

  const handleOnLayout = (event: LayoutChangeEvent) => {
    // We use Math.floor to avoid floating-point precision issues when comparing heights
    const actualHeight = Math.floor(event.nativeEvent.layout.height)
    const expectedMaxHeight = Math.floor(defaultHeight)

    if (actualHeight > expectedMaxHeight + HEIGHT_TOLERANCE) {
      setShouldDisplayButton(true)
      setCurrentNumberOfLines(collapsedLineCount)
    }
  }

  return (
    <React.Fragment>
      <TextContainer collapsedLineCount={collapsedLineCount} defaultHeight={defaultHeight}>
        <Typo.Body
          onLayout={handleOnLayout}
          numberOfLines={expanded ? undefined : currentNumberOfLines}>
          {children}
        </Typo.Body>
      </TextContainer>

      {shouldDisplayButton ? (
        <CollapsibleTextButton expanded={expanded} onPress={() => setExpanded((e) => !e)} />
      ) : null}
    </React.Fragment>
  )
}

const TextContainer = styled.View<{
  collapsedLineCount: number
  defaultHeight: number
}>(({ collapsedLineCount, defaultHeight }) => ({
  maxHeight: collapsedLineCount * defaultHeight,
  overflow: 'hidden',
}))
