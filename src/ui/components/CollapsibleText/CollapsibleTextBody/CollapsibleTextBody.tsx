import React, { FunctionComponent, PropsWithChildren } from 'react'
import { NativeSyntheticEvent, TextLayoutEventData } from 'react-native'

import { Typo } from 'ui/theme'

type Props = {
  numberOfLines?: number
  onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void
} & PropsWithChildren

export const CollapsibleTextBody: FunctionComponent<Props> = ({
  children,
  onTextLayout,
  numberOfLines,
}) => (
  <Typo.Body onTextLayout={onTextLayout} numberOfLines={numberOfLines}>
    {children}
  </Typo.Body>
)
