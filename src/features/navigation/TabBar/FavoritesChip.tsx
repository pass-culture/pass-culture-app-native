import React from 'react'
import styled from 'styled-components/native'

type Props = {
  testID?: string
}

export const FavoritesChip: React.FC<Props> = ({ testID }) => <ChipDot testID={testID} />

const ChipDot = styled.View(({ theme }) => ({
  position: 'absolute',
  top: -theme.designSystem.size.spacing['2xs'],
  right: -theme.designSystem.size.spacing.xs,
  minWidth: theme.designSystem.size.spacing.m,
  minHeight: theme.designSystem.size.spacing.m,
  paddingHorizontal: theme.designSystem.size.spacing.xs,
  borderRadius: theme.designSystem.size.spacing.m,
  backgroundColor: theme.designSystem.color.background.brandPrimary,
  alignItems: 'center',
  justifyContent: 'center',
}))
