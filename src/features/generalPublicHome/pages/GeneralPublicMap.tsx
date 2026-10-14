import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useInitGeneralPublicMap } from 'features/generalPublicHome/hooks/useInitGeneralPublicMap'
import { FilterCategoriesBannerContainer } from 'features/venueMap/components/FilterBannerContainer/FilterCategoriesBannerContainer'
import { VenueMapViewContainer } from 'features/venueMap/components/VenueMapView/VenueMapViewContainer'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const GeneralPublicMap: FunctionComponent = () => {
  useInitGeneralPublicMap()

  return (
    <Container>
      <StyledHeader title="Autour de toi" shouldDisplayBackButton={false} />
      <FilterCategoriesBannerContainer />
      <VenueMapViewContainer />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
})

const StyledHeader = styled(PageHeaderWithoutPlaceholder)(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.default,
}))
