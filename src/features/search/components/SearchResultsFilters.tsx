import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { LocationType } from 'features/search/enums'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { getSpacing, Spacer } from 'ui/theme'

export const SearchResultsFilters: React.FunctionComponent = () => {
  const { searchState } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()
  const { locationFilter } = searchState
  const { locationType } = locationFilter
  // PLACE and VENUE belong to the same section
  const section = locationType === LocationType.VENUE ? LocationType.PLACE : locationType
  const { label: locationLabel } = useLocationChoice(section)

  const onPressLocationButton = useCallback(() => {
    navigate('LocationFilter')
  }, [navigate])

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={2} />

      <FiltersContainer>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ButtonSecondary wording={locationLabel} onPress={onPressLocationButton} />
        </ScrollView>
      </FiltersContainer>
    </React.Fragment>
  )
}

const FiltersContainer = styled.View({
  flexDirection: 'row',
  marginLeft: getSpacing(6),
})
