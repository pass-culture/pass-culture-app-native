import React from 'react'
import styled from 'styled-components/native'

import { SearchLocationWidgetDesktop } from 'features/location/components/SearchLocationWidgetDesktop'
import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer } from 'ui/theme'

export const SearchLocationWidgetDesktopView = () => {
  return (
    <Container>
      <Spacer.Row numberOfSpaces={6} />
      <Separator.Vertical height={getSpacing(6)} />
      <Spacer.Row numberOfSpaces={4} />
      <SearchLocationWidgetDesktop />
    </Container>
  )
}

const Container = styled.View({
  marginTop: getSpacing(1) / 2,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  maxWidth: '25%',
})
