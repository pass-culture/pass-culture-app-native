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
import { venuesFilterActions } from 'features/venueMap/store/venuesFilterStore'
import { MAP_VENUE_TYPE_TO_LABEL } from 'libs/parsers/venueType'
// eslint-disable-next-line local-rules/no-theme-from-theme
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Checkbox } from 'ui/designSystem/Checkbox/Checkbox'
import { getSpacing, Typo } from 'ui/theme'

import { useVenueMapFilters } from '../../hook/useVenueMapFilters'

type Props = StackScreenProps<VenueMapFiltersModalStackParamList, 'VenueMapTypeFilter'>

const titleId = uuidv4()

export const VenueMapTypeFilter: FunctionComponent<Props> = ({ navigation, route }) => {
  const { title, filterGroup } = route.params
  const { navigate } = useNavigation<UseNavigationType>()
  const { activeFilters: venueFilters, toggleMacroFilter } = useVenueMapFilters()
  const { addVenuesFilters, removeVenuesFilters } = venuesFilterActions

  const hasAllFilters = FILTERS_VENUE_TYPE_MAPPING[filterGroup].every((filter) =>
    venueFilters.includes(filter)
  )

  const onGoBack = () => {
    navigation.goBack()
  }

  const onClose = () => {
    navigate('VenueMap')
  }

  const toggleAll = () => {
    toggleMacroFilter(filterGroup, true)
  }

  const venueTypes: VenueTypeCodeKey[] = FILTERS_VENUE_TYPE_MAPPING[filterGroup].filter(
    (item): item is VenueTypeCodeKey => item in MAP_VENUE_TYPE_TO_LABEL
  )

  const handleCheckboxPress = (venueTypeCode: VenueTypeCodeKey) => {
    const hasFilter = venueFilters.includes(venueTypeCode)

    if (hasFilter) {
      removeVenuesFilters([venueTypeCode])
    } else {
      addVenuesFilters([venueTypeCode])
    }
  }

  return (
    <VenueMapFiltersModal
      titleId={titleId}
      title="Type de lieu"
      handleGoBack={onGoBack}
      handleOnClose={onClose}
      shouldDisplayBackButton
      shouldDisplayCloseButton>
      <Container gap={4}>
        <Typo.Title1>{title}</Typo.Title1>
        <Checkbox label="Tout sélectionner" isChecked={hasAllFilters} onPress={toggleAll} />
        {venueTypes.map((venueType) => {
          const isChecked = venueFilters.includes(venueType)
          return (
            <Checkbox
              key={venueType}
              label={MAP_VENUE_TYPE_TO_LABEL[venueType]}
              isChecked={isChecked}
              onPress={() => {
                handleCheckboxPress(venueType)
              }}
            />
          )
        })}
      </Container>
    </VenueMapFiltersModal>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.xl,
  paddingBottom: getSpacing(26),
}))
