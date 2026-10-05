import isPropValid from '@emotion/is-prop-valid'
import React, { PropsWithChildren, FC } from 'react'
import { ShouldForwardProp, StyleSheetManager } from 'styled-components'

export const StylesheetManagerWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <StyleSheetManager shouldForwardProp={shouldForwardProp}>{children}</StyleSheetManager>
}

// [a11y] : Valid HTML attributes that we don't want to forward to the DOM
const BLOCKLISTED_PROPS = new Set(['color'])

// This implements the default behavior from styled-components v5
const shouldForwardProp: ShouldForwardProp<'web'> = (
  propName: string,
  elementToBeCreated: unknown
) => {
  if (typeof elementToBeCreated === 'string') {
    // For HTML elements, forward the prop if it is a valid HTML attribute
    return isPropValid(propName) && !BLOCKLISTED_PROPS.has(propName)
  }
  // For other elements, forward all props
  return true
}
