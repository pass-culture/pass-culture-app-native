import React, { FunctionComponent, PropsWithChildren, Ref } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { parseMarkdown } from 'libs/parsers/parseMarkdown/parseMarkdown'
import { MarkdownPart } from 'ui/components/MarkdownPart/MarkdownPart'
import { MarkdownPartProps } from 'ui/components/types'

type Props = PropsWithChildren<{
  ref?: Ref<Text>
  tabIndex?: 0 | -1
}>

export const Markdown: FunctionComponent<Props> = ({ children, ref, tabIndex }) => {
  const parsedText: MarkdownPartProps[] =
    typeof children === 'string' ? parseMarkdown(children) : []

  return (
    <MarkdowContainer ref={ref} tabIndex={tabIndex}>
      {parsedText.map((part: MarkdownPartProps, index) => (
        // A text can contain several times the same part therefore has no unique identifier
        // If you have better than index you can update
        <MarkdownPart key={`markdown-part-${index}`} {...part} withIcon={false} />
      ))}
    </MarkdowContainer>
  )
}

const MarkdowContainer = styled(Text)({
  flexWrap: 'wrap',
})
