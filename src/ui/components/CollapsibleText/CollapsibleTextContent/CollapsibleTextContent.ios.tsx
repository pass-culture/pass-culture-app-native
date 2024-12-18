import React, { FunctionComponent, useState } from 'react'
import { NativeSyntheticEvent, TextLayoutEventData } from 'react-native'
import { useTheme } from 'styled-components/native'

import { ParsedDescription } from 'libs/parsers/highlightLinks'
import { CollapsibleTextButton } from 'ui/components/CollapsibleText/CollapsibleTextButton/CollapsibleTextButton'
import { TypoDS } from 'ui/theme'

type Props = {
  expanded: boolean
  numberOfLines: number
  renderContent: () => React.JSX.Element[] | ParsedDescription
  onButtonPress: VoidFunction
}

export const CollapsibleTextContent: FunctionComponent<Props> = ({
  expanded,
  numberOfLines,
  renderContent,
  onButtonPress,
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
        {renderContent()}
      </TypoDS.Body>

      {shouldDisplayButton ? (
        <CollapsibleTextButton expanded={expanded} onPress={onButtonPress} />
      ) : null}
    </React.Fragment>
  )
}
