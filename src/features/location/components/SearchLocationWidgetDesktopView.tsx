import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { SearchLocationWidgetDesktop } from 'features/location/components/SearchLocationWidgetDesktop'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const SearchLocationWidgetDesktopView = () => {
  const { designSystem } = useTheme()
  return (
    <StyledViewGap gap={4}>
      <Separator.Vertical height={designSystem.size.spacing.xl} />
      <SearchLocationWidgetDesktop />
    </StyledViewGap>
  )
}

const StyledViewGap = styled(ViewGap)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xxs,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  maxWidth: '25%',
  marginLeft: theme.designSystem.size.spacing.xl,
}))
