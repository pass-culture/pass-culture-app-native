import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { Typo, getSpacing } from 'ui/theme'

type Props = PropsWithChildren<{
  testID?: string
}>

export const TabBarBadge: React.FC<Props> = ({ testID, children }) => (
  <BadgeDot testID={testID}>
    <BadgeText accessibilityElementsHidden importantForAccessibility="no">
      {children ?? '1'}
    </BadgeText>
  </BadgeDot>
)

const BadgeDot = styled.View(({ theme }) => ({
  position: 'absolute',
  top: -theme.designSystem.size.spacing.xxs,
  right: -getSpacing(1),
  minWidth: theme.designSystem.size.spacing.m,
  minHeight: theme.designSystem.size.spacing.m,
  paddingHorizontal: theme.designSystem.size.spacing.xs,
  borderRadius: theme.designSystem.size.spacing.m,
  backgroundColor: theme.designSystem.color.background.brandPrimary,
  alignItems: 'center',
  justifyContent: 'center',
}))

const BadgeText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.inverted,
  textAlign: 'center',
}))
