import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import { Platform } from 'react-native'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { CategoriesListDumb } from 'features/search/components/CategoriesListDumb/CategoriesListDumb'
import { useSortedSearchCategories } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'
import { LocationMode } from 'libs/location/types'

type Props = {
  enableNewCategoryBlocks?: boolean
}

export const CategoriesList: FC<Props> = ({ enableNewCategoryBlocks }) => {
  const isWeb = Platform.OS === 'web'

  const sortedCategories = useSortedSearchCategories()
  const { navigate } = useNavigation<UseNavigationType>()
  const { shouldDisplayVenueMap, selectedLocationMode } = useShouldDisplayVenueMap()

  const isLocated = selectedLocationMode !== LocationMode.EVERYWHERE
  const isMapWithoutPositionAndNotLocated = !isLocated && !isWeb

  return (
    <CategoriesListDumb
      sortedCategories={sortedCategories}
      shouldDisplayVenueMap={shouldDisplayVenueMap}
      isMapWithoutPositionAndNotLocated={isMapWithoutPositionAndNotLocated}
      enableNewCategoryBlocks={enableNewCategoryBlocks}
      onPressVenueMap={() => navigate('VenueMapLocationModal', { openedFrom: 'searchLanding' })}
    />
  )
}
