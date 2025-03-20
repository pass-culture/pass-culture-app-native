import React, { FunctionComponent } from 'react'

import { highlightLinks } from 'libs/parsers/highlightLinks'
import { MarkdownPartProps } from 'ui/components/types'
import { Typo } from 'ui/theme'

export const MarkdownPart: FunctionComponent<MarkdownPartProps> = ({ text, isBold, isItalic }) => {
  if (isBold && !isItalic) {
    return <Typo.BodyAccent testID="styledBodyAccent">{highlightLinks(text)}</Typo.BodyAccent>
  } else if (isItalic && !isBold) {
    return <Typo.BodyItalic testID="styledBodyItalic">{highlightLinks(text)}</Typo.BodyItalic>
  } else if (isItalic && isBold) {
    return (
      <Typo.BodyItalicAccent testID="styledBodyItalicAccent">
        {highlightLinks(text)}
      </Typo.BodyItalicAccent>
    )
  }

  return <Typo.Body testID="styledBody">{highlightLinks(text)}</Typo.Body>
}
