import React from 'react'
import styled from 'styled-components/native'

import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import { VenueMapBlock } from 'features/venueMap/components/VenueMapBlock/VenueMapBlock'
import { getSpacing, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type CategoriesListHeaderProps = {
  shouldDisplayVenueMap: boolean
  showVenueMapLocationModal: () => void
  venueMapLocationModalVisible: boolean
  hideVenueMapLocationModal: () => void
  isMapWithoutPositionAndNotLocated: boolean
}

export const CategoriesListHeader = ({
  shouldDisplayVenueMap,
  showVenueMapLocationModal,
  venueMapLocationModalVisible,
  hideVenueMapLocationModal,
  isMapWithoutPositionAndNotLocated,
}: Readonly<CategoriesListHeaderProps>) => {
  return (
    <React.Fragment>
      {isMapWithoutPositionAndNotLocated || shouldDisplayVenueMap ? (
        <ContainerVenueMapBlock>
          <VenueMapBlock
            onPress={isMapWithoutPositionAndNotLocated ? showVenueMapLocationModal : undefined}
            from="searchLanding"
          />
        </ContainerVenueMapBlock>
      ) : null}
      <CategoriesTitleV2 />
      <VenueMapLocationModal
        visible={venueMapLocationModalVisible}
        dismissModal={hideVenueMapLocationModal}
        openedFrom="searchLanding"
      />
    </React.Fragment>
  )
}

const ContainerVenueMapBlock = styled.View({
  marginTop: getSpacing(4),
  marginBottom: getSpacing(2),
})

const CategoriesTitleV2 = styled(TypoDS.Title4).attrs({
  children: 'Parcours les catégories',
  ...getHeadingAttrs(2),
})(({ theme }) => ({
  marginTop: getSpacing(4),
  marginBottom: getSpacing(theme.isDesktopViewport ? 1 : 2),
  paddingHorizontal: getSpacing(2),
}))
