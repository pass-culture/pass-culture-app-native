import React, { FunctionComponent } from 'react'

import { MarkdownPartProps } from 'features/offer/types'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { TypoDS } from 'ui/theme'

export const MarkdownPart: FunctionComponent<MarkdownPartProps> = ({ text, isBold, isItalic }) => {
  if (isBold && !isItalic) {
    return <TypoDS.BodyAccent testID="styledBodyAccent">{highlightLinks(text)}</TypoDS.BodyAccent>
  } else if (isItalic && !isBold) {
    return <TypoDS.BodyItalic testID="styledBodyItalic">{highlightLinks(text)}</TypoDS.BodyItalic>
  } else if (isItalic && isBold) {
    return (
      <TypoDS.BodyItalicAccent testID="styledBodyItalicAccent">
        {highlightLinks(text)}
      </TypoDS.BodyItalicAccent>
    )
  }

  return <TypoDS.Body testID="styledBody">{highlightLinks(text)}</TypoDS.Body>
}
