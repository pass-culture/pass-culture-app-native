import React from 'react'
import styled from 'styled-components/native'

import { getLineHeightPx } from 'libs/parsers/getLineHeightPx'
import { extractTextFromReactNode } from 'shared/extractTextFromReactNode/extractTextFromReactNode'
import { Li, AccessibleLiProps } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { Dot } from 'ui/svg/icons/Dot'
import { getSpacing, Typo } from 'ui/theme'

type BulletListItemProps = {
  text?: string | React.ReactNode
  spacing?: number
  nestedListTexts?: (string | React.ReactNode)[]
  children?: React.ReactNode
} & Omit<AccessibleLiProps, 'accessibilityLabel' | 'children'>

// Use with Ul or VerticalUl to be accessible in web
export const BulletListItem: React.FC<BulletListItemProps> = ({
  text,
  spacing,
  nestedListTexts,
  index,
  total,
  groupLabel,
  accessibilityRole,
  children,
}) => {
  const baseText = text ?? children
  const accessibilityLabel = extractTextFromReactNode(baseText)

  return (
    <Li
      accessibilityLabel={accessibilityLabel}
      index={index}
      total={total}
      groupLabel={groupLabel}
      accessibilityRole={accessibilityRole}>
      <ItemContainer spacing={spacing}>
        <BulletContainer>
          <Bullet />
        </BulletContainer>
        <ListText>
          {text}
          {children}
        </ListText>
      </ItemContainer>

      {nestedListTexts ? (
        <StyledUl>
          {nestedListTexts.map((itemNested, indexNested) => {
            const baseTextNested = nestedListTexts ?? children
            const accessibilityLabelNested = extractTextFromReactNode(baseTextNested)

            return (
              <Li
                key={indexNested}
                index={indexNested}
                total={nestedListTexts.length}
                groupLabel={accessibilityLabel}
                accessibilityLabel={accessibilityLabelNested}>
                <NestedItemContainer spacing={spacing}>
                  <BulletContainer>
                    <NestedBullet />
                  </BulletContainer>
                  <ListText>{itemNested}</ListText>
                </NestedItemContainer>
              </Li>
            )
          })}
        </StyledUl>
      ) : null}
    </Li>
  )
}

const ItemContainer = styled.View<{ spacing?: number }>(({ theme, spacing }) => ({
  flexDirection: 'row',
  marginLeft: theme.designSystem.size.spacing.m,
  marginTop: spacing ? getSpacing(spacing) : 0,
}))

const NestedItemContainer = styled.View<{ spacing?: number }>(({ theme, spacing }) => ({
  flexDirection: 'row',
  marginLeft: theme.designSystem.size.spacing.xxl,
  marginTop: spacing ? getSpacing(spacing) : 0,
}))

const StyledUl = styled(VerticalUl)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xs,
}))

const Bullet = styled(Dot).attrs({
  size: 3,
})``

const NestedBullet = styled(Dot).attrs(({ theme }) => ({
  size: 3,
  fillColor: theme.designSystem.color.icon.lockedInverted,
}))``

const BulletContainer = styled.View(({ theme }) => ({
  height: getLineHeightPx(theme.designSystem.typography.body.lineHeight, theme.isDesktopViewport),
  justifyContent: 'center',
}))

const ListText = styled(Typo.Body)(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.m,
  flex: 1,
}))
