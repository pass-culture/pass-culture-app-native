import React, { FunctionComponent, PropsWithChildren } from 'react'

import { CollapsibleTextButton } from 'ui/components/CollapsibleText/CollapsibleTextButton/CollapsibleTextButton'
import { Typo } from 'ui/theme'

import { useIsTextEllipsis } from '../useIsTextEllipsis'

type Props = {
  expanded: boolean
  numberOfLines: number
  onButtonPress: VoidFunction
} & PropsWithChildren

export const CollapsibleTextContent: FunctionComponent<Props> = ({
  expanded,
  numberOfLines,
  onButtonPress,
  children,
}) => {
  const {
    onTextLayout,
    onLayout,
    isTextEllipsis: shouldDisplayButton,
  } = useIsTextEllipsis(numberOfLines)

  return (
    <React.Fragment>
      <Typo.Body
        numberOfLines={expanded ? undefined : numberOfLines}
        onLayout={onLayout}
        onTextLayout={onTextLayout}>
        {children}
      </Typo.Body>

      {shouldDisplayButton ? (
        <CollapsibleTextButton expanded={expanded} onPress={onButtonPress} />
      ) : null}
    </React.Fragment>
  )
}
