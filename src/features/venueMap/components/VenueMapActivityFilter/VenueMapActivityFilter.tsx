import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { Activity } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { VenueMapFiltersModalStackParamList } from 'features/navigation/VenueMapFiltersStackNavigator/types'
import { FILTERS_ACTIVITY_MAPPING } from 'features/venueMap/constant'
import { VenueMapFiltersModal } from 'features/venueMap/pages/modals/VenueMapFiltersModal/VenueMapFiltersModal'
import { venuesFilterActions } from 'features/venueMap/store/venuesFilterStore'
// eslint-disable-next-line local-rules/no-theme-from-theme
import { MAP_ACTIVITY_TO_LABEL } from 'libs/parsers/activity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Checkbox } from 'ui/designSystem/Checkbox/Checkbox'
import { getSpacing, Typo } from 'ui/theme'

import { useVenueMapFilters } from '../../hook/useVenueMapFilters'

type Props = NativeStackScreenProps<VenueMapFiltersModalStackParamList, 'VenueMapActivityFilter'>

const titleId = uuidv4()

export const VenueMapActivityFilter: FunctionComponent<Props> = ({ navigation, route }) => {
  const { title, filterGroup } = route.params
  const { navigate } = useNavigation<UseNavigationType>()
  const { activeFilters: venueFilters, toggleMacroFilter } = useVenueMapFilters()
  const { addVenuesFilters, removeVenuesFilters } = venuesFilterActions

  const hasAllFilters = FILTERS_ACTIVITY_MAPPING[filterGroup].every((filter) =>
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

  const activities: Activity[] = FILTERS_ACTIVITY_MAPPING[filterGroup].filter(
    (item): item is Activity => item in MAP_ACTIVITY_TO_LABEL
  )

  const handleCheckboxPress = (activity: Activity) => {
    const hasFilter = venueFilters.includes(activity)

    if (hasFilter) {
      removeVenuesFilters([activity])
    } else {
      addVenuesFilters([activity])
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
        {activities.map((activity) => {
          const isChecked = venueFilters.includes(activity)
          return (
            <Checkbox
              key={activity}
              label={MAP_ACTIVITY_TO_LABEL[activity]}
              isChecked={isChecked}
              onPress={() => {
                handleCheckboxPress(activity)
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
