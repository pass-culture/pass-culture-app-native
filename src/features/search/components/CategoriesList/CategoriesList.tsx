import React, { FC } from 'react'
import { Platform } from 'react-native'

import { CategoriesListDumb } from 'features/search/components/CategoriesListDumb/CategoriesListDumb'
import { useSortedSearchCategories } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'
import { LocationMode } from 'libs/location/types'
import { useModal } from 'ui/components/modals/useModal'

export const CategoriesList: FC = () => {
  const isWeb = Platform.OS === 'web'

  const sortedCategories = useSortedSearchCategories()
  const { shouldDisplayVenueMap, selectedLocationMode } = useShouldDisplayVenueMap()

  const isLocated = selectedLocationMode !== LocationMode.EVERYWHERE
  const isMapWithoutPositionAndNotLocated = !isLocated && !isWeb

  const {
    showModal: showVenueMapLocationModal,
    visible: venueMapLocationModalVisible,
    hideModal: hideVenueMapLocationModal,
  } = useModal()

  return (
    <CategoriesListDumb
      sortedCategories={sortedCategories}
      shouldDisplayVenueMap={shouldDisplayVenueMap}
      isMapWithoutPositionAndNotLocated={isMapWithoutPositionAndNotLocated}
      showVenueMapLocationModal={showVenueMapLocationModal}
      venueMapLocationModalVisible={venueMapLocationModalVisible}
      hideVenueMapLocationModal={hideVenueMapLocationModal}
    />
  )
}
