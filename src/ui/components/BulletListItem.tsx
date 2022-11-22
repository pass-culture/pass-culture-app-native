import React from 'react'
import styled from 'styled-components/native'

import { Li } from 'ui/components/Li'
import { Dot } from 'ui/svg/icons/Dot'
import { getSpacing, Typo } from 'ui/theme'

// Use with Ul or VerticalUl to be accessible in web
export const BulletListItem: React.FC<{
  text?: string
  spacing?: number
}> = ({ text, spacing, children }) => {
  return (
    <Li>
      <ItemContainer spacing={spacing}>
        <BulletContainer>
          <Bullet />
        </BulletContainer>
        <ListText>
          {text}
          {children}
        </ListText>
      </ItemContainer>
    </Li>
  )
}

const ItemContainer = styled.View<{ spacing?: number }>(({ spacing }) => ({
  flexDirection: 'row',
  marginLeft: getSpacing(3),
  marginTop: spacing ? getSpacing(spacing) : 0,
}))

const Bullet = styled(Dot).attrs({
  size: 3,
})``

const BulletContainer = styled.View(({ theme }) => ({
  height: theme.typography.body.lineHeight,
  justifyContent: 'center',
}))

const ListText = styled(Typo.Body)({
  marginLeft: getSpacing(3),
})
