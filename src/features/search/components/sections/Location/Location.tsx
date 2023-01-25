import React from 'react'

import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { useLocationChoice } from 'features/search/helpers/useLocationChoice/useLocationChoice'
import { useLocationType } from 'features/search/helpers/useLocationType/useLocationType'
import { LocationModal } from 'features/search/pages/modals/LocationModal/LocationModal'
import { useModal } from 'ui/components/modals/useModal'
import { BicolorLocationPointer as LocationPointer } from 'ui/svg/icons/BicolorLocationPointer'

type Props = {
  onClose?: VoidFunction
}

export const Location = ({ onClose }: Props) => {
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
        filterBehaviour={FilterBehaviour.APPLY_WITHOUT_SEARCHING}
        onClose={onClose}
      />
    </React.Fragment>
  )
}
