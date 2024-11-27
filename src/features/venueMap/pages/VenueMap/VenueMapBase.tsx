import React, { FunctionComponent, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { FilterBannerContainer } from 'features/venueMap/components/FilterBannerContainer/FilterBannerContainer'
import { FILTER_BANNER_HEIGHT } from 'features/venueMap/constant'
import { useVenueTypeCodeActions } from 'features/venueMap/store/venueTypeCodeStore'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const VenueMapBase: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { goBack } = useGoBack(...getSearchStackConfig('SearchLanding'))
  const { setVenueTypeCode } = useVenueTypeCodeActions()

  const headerHeight = useGetHeaderHeight()

  const handleGoBack = () => {
    setVenueTypeCode(null)
    goBack()
  }

  return (
    <Container>
      <StyledHeader title="Carte des lieux" onGoBack={handleGoBack} />
      <PlaceHolder headerHeight={headerHeight + FILTER_BANNER_HEIGHT} />
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

const PlaceHolder = styled.View<{ headerHeight: number }>(({ headerHeight }) => ({
  height: headerHeight,
}))
