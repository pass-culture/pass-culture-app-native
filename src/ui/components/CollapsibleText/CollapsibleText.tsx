import React, { useState } from 'react'

import { parseMarkdown } from 'features/offer/helpers/parseMarkdown/parseMarkdown'
import { MarkdownPartProps } from 'features/offer/types'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { MarkdownPart } from 'ui/components/MarkdownPart/MarkdownPart'

import { CollapsibleTextContent } from './CollapsibleTextContent/CollapsibleTextContent'

type Props = {
  children: string
  // Minimum number of lines when collapsible is collapsed.
  numberOfLines: number
  isMarkdown?: boolean
}

// TODO(PC-33655): see the possibilities for improving the component
export function CollapsibleText({ children, numberOfLines, isMarkdown }: Readonly<Props>) {
  const [expanded, setExpanded] = useState(false)

  const onButtonPress = () => setExpanded((prevExpanded) => !prevExpanded)

  const renderContent = () => {
    if (isMarkdown) {
      const parsedText: MarkdownPartProps[] = parseMarkdown(children)
      return parsedText.map((part: MarkdownPartProps) => (
        // A text can contain several times the same part therefore has no unique identifier
        // If you have better than Math.random() you can update
        <MarkdownPart key={`markdown-part-${Math.random()}`} {...part} />
      ))
    }

    return highlightLinks(children)
  }

  return (
    <CollapsibleTextContent
      expanded={expanded}
      numberOfLines={numberOfLines}
      renderContent={renderContent}
      onButtonPress={onButtonPress}
    />
  )
}
