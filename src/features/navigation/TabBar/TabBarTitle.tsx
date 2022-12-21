import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { Typo } from 'ui/theme'

interface Props {
  displayName: string
  selected?: boolean
}

export const TabBarTitle: React.FC<Props> = ({ selected, displayName }) => {
  const { tabBar } = useTheme()

  if (tabBar.showLabels) return <Title selected={selected}>{displayName}</Title>
  return <HiddenAccessibleText>{displayName}</HiddenAccessibleText>
}

const Title = styled(Typo.Caption)<{ selected?: boolean }>(({ theme, selected }) => ({
  color: selected ? theme.colors.black : theme.colors.greyDark,
  fontSize: theme.tabBar.fontSize,
  textAlign: 'center',
}))
