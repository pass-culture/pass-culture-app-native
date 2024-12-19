import React, { FunctionComponent } from 'react'

import { parseMarkdown } from 'features/offer/helpers/parseMarkdown/parseMarkdown'
import { MarkdownPartProps } from 'features/offer/types'
import { MarkdownPart } from 'ui/components/MarkdownPart/MarkdownPart'

type Props = {
  text: string
}

export const Markdown: FunctionComponent<Props> = ({ text }) => {
  const parsedText: MarkdownPartProps[] = parseMarkdown(text)

  return (
    <React.Fragment>
      {parsedText.map((part: MarkdownPartProps) => (
        // A text can contain several times the same part therefore has no unique identifier
        // If you have better than Math.random() you can update
        <MarkdownPart key={`markdown-part-${Math.random()}`} {...part} />
      ))}
    </React.Fragment>
  )
}
