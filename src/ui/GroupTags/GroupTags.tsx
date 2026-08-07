import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { Ul } from 'ui/components/Ul'
import { Tag } from 'ui/designSystem/Tag/Tag'

interface Props {
  tags: string[]
}

export function GroupTags({ tags, ...props }: Readonly<Props>) {
  return (
    <Container testID="tagsContainer" {...props}>
      {tags.map((tag) => (
        <Tag label={tag} key={tag} accessibilityRole={AccessibilityRole.LISTITEM} />
      ))}
    </Container>
  )
}

const Container = styled(Ul)(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  overflow: 'hidden',
  gap: theme.designSystem.size.spacing.s,
}))
