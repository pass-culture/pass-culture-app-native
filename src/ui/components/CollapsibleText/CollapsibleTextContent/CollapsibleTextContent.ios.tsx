import React, { FunctionComponent, PropsWithChildren, useState } from 'react'
import { NativeSyntheticEvent, TextLayoutEventData } from 'react-native'
import { useTheme } from 'styled-components/native'

import { CollapsibleTextButton } from 'ui/components/CollapsibleText/CollapsibleTextButton/CollapsibleTextButton'
import { TypoDS } from 'ui/theme'

type Props = {
  expanded: boolean
  numberOfLines: number
  onButtonPress: VoidFunction
} & PropsWithChildren

// It is necessary to have ios.tsx file because the calculation to check that CollapsibleText has a button is different from web and android
export const CollapsibleTextContent: FunctionComponent<Props> = ({
  expanded,
  numberOfLines,
  onButtonPress,
  children,
}) => {
  const theme = useTheme()

  const [maxHeight, setMaxHeight] = useState(0)
  const [currentNumberOfLines, setCurrentNumberOfLines] = useState<number>()
  const [shouldDisplayButton, setShouldDisplayButton] = useState(false)

  const defaultHeight = parseFloat(theme.designSystem.typography.body.lineHeight) * numberOfLines

  const handleOnTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (maxHeight > 0) return

    const lines = event.nativeEvent.lines
    const currentMaxHeight = lines.reduce((total, line) => total + line.height, 0)
    setMaxHeight(currentMaxHeight)
    setCurrentNumberOfLines(numberOfLines)

    if (currentMaxHeight > defaultHeight) {
      setShouldDisplayButton(true)
    }
  }

  return (
    <React.Fragment>
      <TypoDS.Body
        onTextLayout={handleOnTextLayout}
        numberOfLines={expanded ? undefined : currentNumberOfLines}>
        {children}
      </TypoDS.Body>

      {shouldDisplayButton ? (
        <CollapsibleTextButton expanded={expanded} onPress={onButtonPress} />
      ) : null}
    </React.Fragment>
  )
}
