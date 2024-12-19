import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { MarkdownPartProps } from 'features/offer/types'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { TypoDS } from 'ui/theme'

export const MarkdownPart: FunctionComponent<MarkdownPartProps> = ({
  text,
  isBold,
  isItalic,
  isUnderline,
}) => {
  if (isBold && !isItalic) {
    return (
      <StyledBodyAccent isUnderline={isUnderline} testID="styledBodyAccent">
        {highlightLinks(text)}
      </StyledBodyAccent>
    )
  } else if (isItalic && !isBold) {
    return (
      <StyledBodyItalic isUnderline={isUnderline} testID="styledBodyItalic">
        {highlightLinks(text)}
      </StyledBodyItalic>
    )
  } else if (isItalic && isBold) {
    return (
      <StyledBodyItalicAccent isUnderline={isUnderline} testID="styledBodyItalicAccent">
        {highlightLinks(text)}
      </StyledBodyItalicAccent>
    )
  }

  return (
    <StyledBody isUnderline={isUnderline} testID="styledBody">
      {highlightLinks(text)}
    </StyledBody>
  )
}

const StyledBody = styled(TypoDS.Body)<{ isUnderline?: boolean }>(({ isUnderline }) => ({
  textDecorationLine: isUnderline ? 'underline' : 'none',
}))

const StyledBodyAccent = styled(TypoDS.BodyAccent)<{ isUnderline?: boolean }>(
  ({ isUnderline }) => ({
    textDecorationLine: isUnderline ? 'underline' : 'none',
  })
)

const StyledBodyItalic = styled(TypoDS.BodyItalic)<{ isUnderline?: boolean }>(
  ({ isUnderline }) => ({
    textDecorationLine: isUnderline ? 'underline' : 'none',
  })
)

const StyledBodyItalicAccent = styled(TypoDS.BodyItalicAccent)<{ isUnderline?: boolean }>(
  ({ isUnderline }) => ({
    textDecorationLine: isUnderline ? 'underline' : 'none',
  })
)
