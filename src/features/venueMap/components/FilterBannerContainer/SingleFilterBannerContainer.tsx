import React from 'react'
import styled from 'styled-components/native'

import { SingleFilterButton } from 'features/search/components/Buttons/SingleFilterButton/SingleFilterButton'
import { getVenueTypeLabel } from 'features/venueMap/helpers/getVenueTypeLabel/getVenueTypeLabel'
import { VenueTypeModal } from 'features/venueMap/pages/modals/VenueTypeModal/VenueTypeModal'
import { useVenueMapStore } from 'features/venueMap/store/venueMapStore'
import { ellipseString } from 'shared/string/ellipseString'
import { Li } from 'ui/components/Li'
import { useModal } from 'ui/components/modals/useModal'
import { Ul } from 'ui/components/Ul'
import { Check } from 'ui/svg/icons/Check'
import { getSpacing } from 'ui/theme'

const MAX_VENUE_CHARACTERS = 20

export const SingleFilterBannerContainer = () => {
  const venueTypeCode = useVenueMapStore((state) => state.venueTypeCode)
  const venueTypeLabel = getVenueTypeLabel(venueTypeCode) ?? 'Tous les lieux'

  const {
    visible: venueTypeModalVisible,
    showModal: showVenueTypeModal,
    hideModal: hideVenueTypeModal,
  } = useModal(false)

  return (
    <React.Fragment>
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
      <VenueTypeModal hideModal={hideVenueTypeModal} isVisible={venueTypeModalVisible} />
    </React.Fragment>
  )
}

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
