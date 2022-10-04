import React from 'react'
import styled from 'styled-components/native'

import { FilterRow } from 'features/search/atoms/FilterRow'
import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { LocationModal } from 'features/search/pages/LocationModal'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useLocationType } from 'features/search/pages/useLocationType'
import { useModal } from 'ui/components/modals/useModal'

export function Location() {
  const { searchState } = useSearch()
  const { section } = useLocationType(searchState)
  const { Icon, label } = useLocationChoice(section)

  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    color: theme.colors.black,
    color2: theme.colors.black,
  }))``

  const {
    visible: locationModalVisible,
    showModal: showLocationModal,
    hideModal: hideLocationModal,
  } = useModal(false)

  return (
    <React.Fragment>
      <FilterRow
        icon={StyledIcon}
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
