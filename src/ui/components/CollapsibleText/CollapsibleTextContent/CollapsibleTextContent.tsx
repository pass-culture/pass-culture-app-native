import React, { FunctionComponent } from 'react'

import { ParsedDescription } from 'libs/parsers/highlightLinks'
import { CollapsibleTextButton } from 'ui/components/CollapsibleText/CollapsibleTextButton/CollapsibleTextButton'
import { TypoDS } from 'ui/theme'

import { useIsTextEllipsis } from '../useIsTextEllipsis'

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
  const {
    onTextLayout,
    onLayout,
    isTextEllipsis: shouldDisplayButton,
  } = useIsTextEllipsis(numberOfLines)

  return (
    <React.Fragment>
      <TypoDS.Body
        numberOfLines={expanded ? undefined : numberOfLines}
        onLayout={onLayout}
        onTextLayout={onTextLayout}>
        {renderContent()}
      </TypoDS.Body>

      {shouldDisplayButton ? (
        <CollapsibleTextButton expanded={expanded} onPress={onButtonPress} />
      ) : null}
    </React.Fragment>
  )
}
