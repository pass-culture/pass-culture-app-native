import React from 'react'
import styled from 'styled-components/native'

import { SearchLocationWidgetDesktop } from 'features/location/components/SearchLocationWidgetDesktop'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

export const SearchLocationWidgetDesktopView = () => {
  return (
    <StyledViewGap gap={4}>
      <Separator.Vertical height={getSpacing(6)} />
      <SearchLocationWidgetDesktop />
    </StyledViewGap>
  )
}

const StyledViewGap = styled(ViewGap)(({ theme }) => ({
  marginTop: getSpacing(1) / 2,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  maxWidth: '25%',
  marginLeft: theme.designSystem.size.spacing.xl,
}))
