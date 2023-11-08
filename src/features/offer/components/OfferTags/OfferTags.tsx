import React, { useLayoutEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Tag } from 'ui/components/Tag/Tag'
import { getSpacing } from 'ui/theme'

interface Props {
  tags: string[]
  tagsLines?: number
}

export const MARGIN_BOTTOM_TAGS = getSpacing(2)

// This component is used to display tags on a number of lines defined as a parameter.
// If the number of tags to display exceeds this limit, it will not be visible
export function OfferTags({ tags, tagsLines = 2 }: Readonly<Props>) {
  // It is used to dynamically calculate the height of a tag
  // We use it only on the first tag render to avoid unnecessary computations
  // By limiting its usage in this way, we optimize performance by avoiding unnecessary calculations.
  const tagRef = useRef<View>(null)
  const [tagHeight, setTagHeight] = useState(0)
  const maxContainerHeight = (tagHeight + MARGIN_BOTTOM_TAGS) * tagsLines

  useLayoutEffect(() => {
    if (tagRef.current) {
      tagRef.current.measure((_x, _y, _width, height) => setTagHeight(height))
    }
  }, [])

  return (
    <Container maxHeight={maxContainerHeight} testID="tagsContainer">
      {tags.map((tag, index) => (
        <TagContainer ref={index === 0 ? tagRef : undefined} key={tag}>
          <Tag label={tag} />
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
  marginRight: getSpacing(2),
  marginBottom: MARGIN_BOTTOM_TAGS,
})
