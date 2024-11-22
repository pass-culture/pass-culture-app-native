import React, { FunctionComponent, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { SingleFilterButton } from 'features/search/components/Buttons/SingleFilterButton/SingleFilterButton'
import { FILTER_BANNER_HEIGHT } from 'features/venueMap/components/VenueMapView/constant'
import { getVenueTypeLabel } from 'features/venueMap/helpers/getVenueTypeLabel/getVenueTypeLabel'
import { VenueTypeModal } from 'features/venueMap/pages/modals/VenueTypeModal/VenueTypeModal'
import {
  useVenueTypeCode,
  useVenueTypeCodeActions,
} from 'features/venueMap/store/venueTypeCodeStore'
import { ellipseString } from 'shared/string/ellipseString'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Li } from 'ui/components/Li'
import { useModal } from 'ui/components/modals/useModal'
import { Ul } from 'ui/components/Ul'
import { Check } from 'ui/svg/icons/Check'
import { getSpacing } from 'ui/theme'

const MAX_VENUE_CHARACTERS = 20

export const VenueMapBase: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { goBack } = useGoBack(...getSearchStackConfig('SearchLanding'))

  const venueTypeCode = useVenueTypeCode()
  const { setVenueTypeCode } = useVenueTypeCodeActions()

  const headerHeight = useGetHeaderHeight()

  const {
    visible: venueTypeModalVisible,
    showModal: showVenueTypeModal,
    hideModal: hideVenueTypeModal,
  } = useModal(false)

  const venueTypeLabel = getVenueTypeLabel(venueTypeCode) ?? 'Tous les lieux'

  const handleGoBack = () => {
    setVenueTypeCode(null)
    goBack()
  }

  return (
    <React.Fragment>
      <Container>
        <StyledHeader title="Carte des lieux" onGoBack={handleGoBack} />
        <PlaceHolder headerHeight={headerHeight + FILTER_BANNER_HEIGHT} />

        <FilterBannerContainer headerHeight={headerHeight}>
          <StyledUl>
            <StyledLi>
              <SingleFilterButton
                label={ellipseString(venueTypeLabel, MAX_VENUE_CHARACTERS)}
                isSelected={venueTypeCode !== null}
                onPress={showVenueTypeModal}
                icon={venueTypeCode ? <FilterSelectedIcon /> : undefined}
              />
            </StyledLi>
          </StyledUl>
        </FilterBannerContainer>
        {children}
      </Container>
      <VenueTypeModal hideModal={hideVenueTypeModal} isVisible={venueTypeModalVisible} />
    </React.Fragment>
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

const FilterBannerContainer = styled.View<{ headerHeight: number }>(({ headerHeight }) => ({
  height: FILTER_BANNER_HEIGHT,
  position: 'absolute',
  zIndex: 1,
  top: headerHeight,
  left: 0,
  right: 0,
  paddingHorizontal: getSpacing(6),
  paddingVertical: getSpacing(1),
}))

const StyledUl = styled(Ul)({
  alignItems: 'center',
})

const StyledLi = styled(Li)({
  marginLeft: getSpacing(1),
  marginVertical: getSpacing(1),
})

const FilterSelectedIcon = styled(Check).attrs<{ testID?: string }>(({ theme, testID }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.black,
  testID: testID ? `${testID}Icon` : 'filterButtonIcon',
}))``
