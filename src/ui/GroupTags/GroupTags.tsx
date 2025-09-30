import React from 'react'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Tag } from 'ui/designSystem/Tag/Tag'

interface Props {
  tags: string[]
}

export function GroupTags({ tags, ...props }: Readonly<Props>) {
  return (
    <Container gap={2} testID="tagsContainer" {...props}>
      {tags.map((tag) => (
        <Tag label={tag} key={tag} />
      ))}
    </Container>
  )
}

const Container = styled(ViewGap)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  overflow: 'hidden',
})
