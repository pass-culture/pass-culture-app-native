import React, { FunctionComponent, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { getSearchHookConfig } from 'features/navigation/navigators/SearchStackNavigator/getSearchHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { FilterCategoriesBannerContainer } from 'features/venueMap/components/FilterBannerContainer/FilterCategoriesBannerContainer'
import { venuesFilterActions } from 'features/venueMap/store/venuesFilterStore'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const VenueMapBase: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { goBack } = useGoBack(...getSearchHookConfig('SearchLanding'))
  const { setVenuesFilters } = venuesFilterActions

  const handleGoBack = () => {
    setVenuesFilters([])
    goBack()
  }

  return (
    <Container>
      <StyledHeader title="Carte des lieux" onGoBack={handleGoBack} />
      <FilterCategoriesBannerContainer />
      {children}
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
})

const StyledHeader = styled(PageHeaderWithoutPlaceholder)(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.default,
}))
