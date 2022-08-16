import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { LocationType } from 'features/search/enums'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { getSpacing, Spacer } from 'ui/theme'

export const SearchResultsFilters: React.FunctionComponent = () => {
  const { searchState } = useSearch()
  const { locationFilter } = searchState
  const { locationType } = locationFilter
  // PLACE and VENUE belong to the same section
  const section = locationType === LocationType.VENUE ? LocationType.PLACE : locationType
  const { label: locationLabel } = useLocationChoice(section)
  const { data: appSettings } = useAppSettings()
  // use for filters buttons on search results view
  const appEnableCategoryFilterPage = appSettings?.appEnableCategoryFilterPage ?? false

  return appEnableCategoryFilterPage ? (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={2} />
      <FiltersContainer>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ButtonSecondary wording={locationLabel} testID="locationButton" />
        </ScrollView>
      </FiltersContainer>
    </React.Fragment>
  ) : null
}

const FiltersContainer = styled.View({
  flexDirection: 'row',
  marginLeft: getSpacing(6),
})
