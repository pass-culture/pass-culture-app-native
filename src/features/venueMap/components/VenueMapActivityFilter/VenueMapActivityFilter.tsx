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
import { MAP_ACTIVITY_TO_LABEL } from 'libs/parsers/activity'
import { CheckboxGroup } from 'ui/designSystem/CheckboxGroup/CheckboxGroup'
import { getSpacing } from 'ui/theme'

import { useVenueMapFilters } from '../../hook/useVenueMapFilters'

type Props = NativeStackScreenProps<VenueMapFiltersModalStackParamList, 'VenueMapActivityFilter'>

const titleId = uuidv4()
const ALL_VALUE = 'ALL'

export const VenueMapActivityFilter: FunctionComponent<Props> = ({ navigation, route }) => {
  const { title, filterGroup } = route.params
  const { popTo } = useNavigation<UseNavigationType>()
  const { activeFilters: venueFilters } = useVenueMapFilters()
  const { addVenuesFilters, removeVenuesFilters } = venuesFilterActions

  const activities: Activity[] = FILTERS_ACTIVITY_MAPPING[filterGroup].filter(
    (item): item is Activity => item in MAP_ACTIVITY_TO_LABEL
  )

  const hasAllFilters =
    activities.length > 0 && activities.every((activity) => venueFilters.includes(activity))

  const someSelected =
    activities.some((activity) => venueFilters.includes(activity)) && !hasAllFilters

  const options = [
    {
      label: 'Tout sélectionner',
      value: ALL_VALUE,
      indeterminate: someSelected,
    },
    ...activities.map((activity) => ({
      label: MAP_ACTIVITY_TO_LABEL[activity],
      value: activity,
    })),
  ]

  const handleChange = (newValues: string[]) => {
    const wasAllSelected = hasAllFilters
    const isAllSelectedNow = newValues.includes(ALL_VALUE)

    if (!wasAllSelected && isAllSelectedNow) {
      addVenuesFilters(activities.filter((activity) => !venueFilters.includes(activity)))
      return
    }

    if (wasAllSelected && !isAllSelectedNow) {
      removeVenuesFilters(activities)
      return
    }

    const selectedActivities = newValues.filter((value): value is Activity => value !== ALL_VALUE)
    const toAdd = selectedActivities.filter((activity) => !venueFilters.includes(activity))
    const toRemove = venueFilters.filter((activity) => !selectedActivities.includes(activity))

    if (toAdd.length) addVenuesFilters(toAdd)
    if (toRemove.length) removeVenuesFilters(toRemove)
  }

  const onGoBack = () => navigation.goBack()
  const onClose = () => popTo('VenueMap')

  return (
    <VenueMapFiltersModal
      titleId={titleId}
      title="Type de lieu"
      handleGoBack={onGoBack}
      handleOnClose={onClose}
      shouldDisplayBackButton
      shouldDisplayCloseButton>
      <Container>
        <CheckboxGroup<string>
          labelTag="h1"
          label={title}
          options={options}
          value={[...venueFilters, ...(hasAllFilters ? [ALL_VALUE] : [])]}
          onChange={handleChange}
        />
      </Container>
    </VenueMapFiltersModal>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.xl,
  paddingBottom: getSpacing(26),
}))
