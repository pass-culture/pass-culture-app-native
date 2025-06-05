import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled, { ThemeProvider } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { VenueMapFiltersModalStackParamList } from 'features/navigation/VenueMapFiltersStackNavigator/types'
import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import { VenueMapFiltersModal } from 'features/venueMap/pages/modals/VenueMapFiltersModal/VenueMapFiltersModal'
import { venuesFilterActions } from 'features/venueMap/store/venuesFilterStore'
import { MAP_VENUE_TYPE_TO_LABEL, VenueTypeCode } from 'libs/parsers/venueType'
import { theme } from 'theme'
import { CheckboxDeprecated } from 'ui/components/inputs/Checkbox/CheckboxDeprecated'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, Typo } from 'ui/theme'

import { useVenueMapFilters } from '../../hook/useVenueMapFilters'

type Props = StackScreenProps<VenueMapFiltersModalStackParamList, 'VenueMapTypeFilter'>

const ALTERED_THEME = {
  ...theme,
  showTabBar: !!theme.showTabBar,
  borderRadius: {
    ...theme.borderRadius,
    checkbox: 2,
  },
  checkbox: {
    ...theme.checkbox,
    size: getSpacing(4),
  },
}

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

  const venueTypes: VenueTypeCode[] = FILTERS_VENUE_TYPE_MAPPING[filterGroup].filter(
    (item): item is VenueTypeCode => item in MAP_VENUE_TYPE_TO_LABEL
  )

  const handleCheckboxPress = (venueTypeCode: VenueTypeCode) => {
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
      <Container gap={6}>
        <ThemeProvider theme={ALTERED_THEME}>
          <Typo.Title1>{title}</Typo.Title1>
          <SelectAllCheckBox
            label="Tout sélectionner"
            isChecked={hasAllFilters}
            onPress={toggleAll}
            LabelComponent={hasAllFilters ? Typo.Button : undefined}
          />
          {venueTypes.map((venueType) => {
            const isChecked = venueFilters.includes(venueType)
            return (
              <StyledCheckbox
                key={venueType}
                label={MAP_VENUE_TYPE_TO_LABEL[venueType]}
                isChecked={isChecked}
                LabelComponent={isChecked ? LabelCheckbox : undefined}
                onPress={() => {
                  handleCheckboxPress(venueType)
                }}
              />
            )
          })}
        </ThemeProvider>
      </Container>
    </VenueMapFiltersModal>
  )
}

const Container = styled(ViewGap)({
  paddingTop: getSpacing(6),
  paddingBottom: getSpacing(26),
})

const StyledCheckbox = styled(CheckboxDeprecated)({
  flexDirection: 'row-reverse',
  justifyContent: 'space-between',
})

const SelectAllCheckBox = styled(StyledCheckbox)({
  marginBottom: getSpacing(2),
})

const LabelCheckbox = styled(Typo.Button)({
  alignSelf: 'center',
  flex: 1,
})
