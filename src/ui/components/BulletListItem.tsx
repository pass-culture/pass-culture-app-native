import React from 'react'
import styled from 'styled-components/native'

import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { Dot } from 'ui/svg/icons/Dot'
import { getSpacing, Typo } from 'ui/theme'

// Use with Ul or VerticalUl to be accessible in web
export const BulletListItem: React.FC<{
  text?: string
  spacing?: number
  nestedListTexts?: string[]
}> = ({ text, spacing, nestedListTexts, children }) => {
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
      {!!nestedListTexts && (
        <StyledUl>
          {nestedListTexts.map((itemText, idx) => {
            return (
              <Li key={idx}>
                <NestedItemContainer spacing={spacing}>
                  <BulletContainer>
                    <NestedBullet />
                  </BulletContainer>
                  <ListText>{itemText}</ListText>
                </NestedItemContainer>
              </Li>
            )
          })}
        </StyledUl>
      )}
    </Li>
  )
}

const ItemContainer = styled.View<{ spacing?: number }>(({ spacing }) => ({
  flexDirection: 'row',
  marginLeft: getSpacing(3),
  marginTop: spacing ? getSpacing(spacing) : 0,
}))

const NestedItemContainer = styled.View<{ spacing?: number }>(({ spacing }) => ({
  flexDirection: 'row',
  marginLeft: getSpacing(7),
  marginTop: spacing ? getSpacing(spacing) : 0,
}))

const StyledUl = styled(VerticalUl)({
  marginVertical: getSpacing(1),
})

const Bullet = styled(Dot).attrs({
  size: 3,
})``

const NestedBullet = styled(Dot).attrs(({ theme }) => ({
  size: 3,
  fillColor: theme.colors.transparent,
}))``

const BulletContainer = styled.View(({ theme }) => ({
  height: theme.typography.body.lineHeight,
  justifyContent: 'center',
}))

const ListText = styled(Typo.Body)({
  marginLeft: getSpacing(3),
  flex: 1,
})
