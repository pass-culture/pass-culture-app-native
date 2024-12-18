import React, { memo } from 'react'
import { Platform } from 'react-native'

import { DumbCategoriesList } from 'features/search/components/DumbCategoriesList/DumbCategoriesList'
import { useShowResultsForCategory } from 'features/search/helpers/useShowResultsForCategory/useShowResultsForCategory'
import { useSortedSearchCategories } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'
import { LocationMode } from 'libs/location/types'
import { useModal } from 'ui/components/modals/useModal'

export const CategoriesList = memo(function CategoriesButtons() {
  const showResultsForCategory = useShowResultsForCategory()
  const isWeb = Platform.OS === 'web'

  const sortedCategories = useSortedSearchCategories(showResultsForCategory)
  const { shouldDisplayVenueMap, selectedLocationMode } = useShouldDisplayVenueMap()

  const isLocated = selectedLocationMode !== LocationMode.EVERYWHERE
  const isMapWithoutPositionAndNotLocated = !isLocated && !isWeb

  const {
    showModal: showVenueMapLocationModal,
    visible: venueMapLocationModalVisible,
    hideModal: hideVenueMapLocationModal,
  } = useModal()

  return (
    <DumbCategoriesList
      sortedCategories={sortedCategories}
      shouldDisplayVenueMap={shouldDisplayVenueMap}
      isMapWithoutPositionAndNotLocated={isMapWithoutPositionAndNotLocated}
      showVenueMapLocationModal={showVenueMapLocationModal}
      venueMapLocationModalVisible={venueMapLocationModalVisible}
      hideVenueMapLocationModal={hideVenueMapLocationModal}
    />
  )
})
