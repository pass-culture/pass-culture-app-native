import React from 'react'
import styled from 'styled-components/native'

import { Tag, TAG_HEIGHT } from 'ui/designSystem/Tag/Tag'
import { getSpacing } from 'ui/theme'

interface Props {
  tags: string[]
  tagsLines?: number
}

const TAG_GAP = getSpacing(2)

// This component is used to display tags on a number of lines defined as a parameter.
// If the number of tags to display exceeds this limit, it will not be visible
export function InformationTags({ tags, tagsLines = 2, ...props }: Readonly<Props>) {
  const maxContainerHeight = TAG_HEIGHT * tagsLines + TAG_GAP * (tagsLines - 1)

  return (
    <Container maxHeight={maxContainerHeight} testID="tagsContainer" {...props}>
      {tags.map((tag) => (
        <Tag label={tag} key={tag} />
      ))}
    </Container>
  )
}

const Container = styled.View<{ maxHeight: number }>(({ maxHeight }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  overflow: 'hidden',
  maxHeight,
  gap: TAG_GAP,
}))
