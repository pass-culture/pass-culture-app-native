import isPropValid from '@emotion/is-prop-valid'
import React, { PropsWithChildren, FC } from 'react'
import { ShouldForwardProp, StyleSheetManager } from 'styled-components'

export const StylesheetManagerWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <StyleSheetManager shouldForwardProp={shouldForwardProp}>{children}</StyleSheetManager>
}

// This implements the default behavior from styled-components v5
const shouldForwardProp: ShouldForwardProp<'web'> = (
  propName: string,
  elementToBeCreated: unknown
) => {
  if (typeof elementToBeCreated === 'string') {
    // For HTML elements, forward the prop if it is a valid HTML attribute
    return isPropValid(propName)
  }
  // For other elements, forward all props
  return true
}
