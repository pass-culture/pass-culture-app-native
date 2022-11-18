import React from 'react'

import { FilterRow } from 'features/search/atoms/FilterRow'
import { useLocationChoice } from 'features/search/components/useLocationChoice'
import { LocationModal } from 'features/search/pages/LocationModal'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useLocationType } from 'features/search/pages/useLocationType'
import { useModal } from 'ui/components/modals/useModal'
import { BicolorLocationPointer as LocationPointer } from 'ui/svg/icons/BicolorLocationPointer'

export function Location() {
  const { searchState } = useSearch()
  const { section } = useLocationType(searchState)
  const { label } = useLocationChoice(section)

  const {
    visible: locationModalVisible,
    showModal: showLocationModal,
    hideModal: hideLocationModal,
  } = useModal(false)

  return (
    <React.Fragment>
      <FilterRow
        icon={LocationPointer}
        title="Localisation"
        description={label}
        onPress={showLocationModal}
      />
      <LocationModal
        title="Localisation"
        accessibilityLabel="Ne pas filtrer par localisation et retourner aux filtres de recherche"
        isVisible={locationModalVisible}
        hideModal={hideLocationModal}
      />
    </React.Fragment>
  )
}
