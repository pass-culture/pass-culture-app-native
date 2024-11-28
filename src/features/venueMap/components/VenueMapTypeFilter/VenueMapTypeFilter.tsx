import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { VenueTypeCodeKey } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { VenueMapFiltersModalStackParamList } from 'features/navigation/VenueMapFiltersStackNavigator/types'
import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import { VenueMapFiltersModal } from 'features/venueMap/pages/modals/VenueMapFiltersModal/VenueMapFiltersModal'
import { useVenuesFilter, useVenuesFilterActions } from 'features/venueMap/store/venuesFilterStore'
import { MAP_VENUE_TYPE_TO_LABEL, VenueTypeCode } from 'libs/parsers/venueType'
import { Checkbox } from 'ui/components/inputs/Checkbox/Checkbox'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, TypoDS } from 'ui/theme'

type Props = StackScreenProps<VenueMapFiltersModalStackParamList, 'VenueMapTypeFilter'>

const titleId = uuidv4()

export const VenueMapTypeFilter: FunctionComponent<Props> = ({ navigation, route }) => {
  const { title, filterGroup } = route.params
  const { navigate } = useNavigation<UseNavigationType>()
  const venueFilters = useVenuesFilter()
  const { addVenuesFilters, removeVenuesFilters, setVenuesFilters } = useVenuesFilterActions()

  const onGoBack = () => {
    navigation.goBack()
  }

  const onClose = () => {
    navigate('VenueMap')
  }

  const toggleFilters = (isChecked: boolean, filters: VenueTypeCodeKey[]) => {
    if (isChecked) {
      if (hasAllFilters) {
        // Only the current selection is filtered
        setVenuesFilters(filters)
        return
      }
      addVenuesFilters(filters)
      return
    }
    removeVenuesFilters(filters)
  }

  const toggleAll = (isChecked: boolean) => {
    toggleFilters(isChecked, FILTERS_VENUE_TYPE_MAPPING[filterGroup])
  }

  const toggleVenueType = (isChecked: boolean, venueType: VenueTypeCodeKey) => {
    toggleFilters(isChecked, [venueType])
  }

  const venueTypes: VenueTypeCode[] = FILTERS_VENUE_TYPE_MAPPING[filterGroup].filter(
    (item): item is VenueTypeCode => item in MAP_VENUE_TYPE_TO_LABEL
  )
  const hasAllFilters = FILTERS_VENUE_TYPE_MAPPING[filterGroup].every((filter) =>
    venueFilters.includes(filter)
  )
  const isCheckedShowAll = venueFilters.length === 0 || hasAllFilters

  return (
    <VenueMapFiltersModal
      titleId={titleId}
      title="Type de lieu"
      handleGoBack={onGoBack}
      handleOnClose={onClose}
      shouldDisplayBackButton
      shouldDisplayCloseButton>
      <Container gap={6}>
        <TypoDS.Title1>{title}</TypoDS.Title1>
        <Checkbox label="Tout afficher" isChecked={isCheckedShowAll} onPress={toggleAll} />
        {venueTypes.map((venueType) => (
          <Checkbox
            key={venueType}
            label={MAP_VENUE_TYPE_TO_LABEL[venueType]}
            isChecked={venueFilters.includes(venueType) && !hasAllFilters}
            onPress={(isChecked: boolean) => toggleVenueType(isChecked, venueType)}
          />
        ))}
      </Container>
    </VenueMapFiltersModal>
  )
}

const Container = styled(ViewGap)({
  paddingTop: getSpacing(6),
  paddingBottom: getSpacing(26),
})
