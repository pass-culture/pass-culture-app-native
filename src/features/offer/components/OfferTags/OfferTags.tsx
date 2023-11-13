import React from 'react'
import styled from 'styled-components/native'

import { Tag, TAG_HEIGHT } from 'ui/components/Tag/Tag'
import { getSpacing } from 'ui/theme'

interface Props {
  tags: string[]
  tagsLines?: number
}

export const MARGIN_BOTTOM_TAGS = getSpacing(2)

// This component is used to display tags on a number of lines defined as a parameter.
// If the number of tags to display exceeds this limit, it will not be visible
export function OfferTags({ tags, tagsLines = 2 }: Readonly<Props>) {
  const maxContainerHeight = TAG_HEIGHT * tagsLines + MARGIN_BOTTOM_TAGS * (tagsLines - 1)

  return (
    <Container maxHeight={maxContainerHeight} testID="tagsContainer">
      {tags.map((tag) => (
        <StyledTag label={tag} key={tag} />
      ))}
    </Container>
  )
}

const Container = styled.View<{ maxHeight: number }>(({ maxHeight }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  overflow: 'hidden',
  maxHeight,
}))

const StyledTag = styled(Tag)({
  marginRight: getSpacing(2),
  marginBottom: MARGIN_BOTTOM_TAGS,
})
