import React, { FunctionComponent, PropsWithChildren } from 'react'

import { parseMarkdown } from 'libs/parsers/parseMarkdown/parseMarkdown'
import { MarkdownPart } from 'ui/components/MarkdownPart/MarkdownPart'
import { MarkdownPartProps } from 'ui/components/types'

export const Markdown: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const parsedText: MarkdownPartProps[] =
    typeof children === 'string' ? parseMarkdown(children) : []

  return (
    <React.Fragment>
      {parsedText.map((part: MarkdownPartProps, index) => (
        // A text can contain several times the same part therefore has no unique identifier
        // If you have better than index you can update
        <MarkdownPart key={`markdown-part-${index}`} {...part} withIcon={false} />
      ))}
    </React.Fragment>
  )
}
