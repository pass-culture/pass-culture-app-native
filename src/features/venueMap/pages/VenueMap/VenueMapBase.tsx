import React, { FunctionComponent, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { FilterBannerContainer } from 'features/venueMap/components/FilterBannerContainer/FilterBannerContainer'
import { setVenueTypeCode } from 'features/venueMap/store/venueMapStore'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const VenueMapBase: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { goBack } = useGoBack(...getSearchStackConfig('SearchLanding'))

  const handleGoBack = () => {
    setVenueTypeCode(null)
    goBack()
  }

  return (
    <Container>
      <StyledHeader title="Carte des lieux" onGoBack={handleGoBack} />
      <FilterBannerContainer />
      {children}
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
})

const StyledHeader = styled(PageHeaderWithoutPlaceholder)(({ theme }) => ({
  backgroundColor: theme.colors.white,
}))
