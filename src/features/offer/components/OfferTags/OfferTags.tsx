import React, { useLayoutEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Tag } from 'ui/components/Tag/Tag'
import { getSpacing } from 'ui/theme'

interface Props {
  tags: string[]
}

const MARGIN_BOTTOM_TAGS = getSpacing(2)
const TAGS_LINES = 2

export function OfferTags({ tags }: Readonly<Props>) {
  const tagRef = useRef<View>(null)
  const [tagHeight, setTagHeight] = useState<number>(0)
  const maxContainerHeight = tagHeight * TAGS_LINES + MARGIN_BOTTOM_TAGS

  useLayoutEffect(() => {
    if (tagRef.current) {
      tagRef.current.measure((_x, _y, _width, height) => setTagHeight(height))
    }
  }, [])

  return (
    <Container maxHeight={maxContainerHeight}>
      {tags.map((tag, index) => (
        <TagContainer ref={index === 0 ? tagRef : undefined} key={tag}>
          <StyledTag label={tag} />
        </TagContainer>
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

const TagContainer = styled(View)({
  marginBottom: getSpacing(2),
})

const StyledTag = styled(Tag)({
  marginRight: getSpacing(2),
})
