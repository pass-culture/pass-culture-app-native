import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { LocationType } from 'features/search/enums'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { LocationFilter } from 'features/search/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useGeolocation } from 'libs/geolocation'
import { plural } from 'libs/plural'
import { ClippedTag } from 'ui/components/ClippedTag'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  nbHits: number
}

export const NumberOfResults: React.FC<Props> = ({ nbHits }) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState } = useSearch()
  const { dispatch: dispatchStagedSearch } = useStagedSearch()
  const { position } = useGeolocation()

  const venueLabel =
    searchState.locationFilter.locationType === LocationType.VENUE
      ? searchState.locationFilter.venue.label
      : null

  const removeVenueId = useCallback(() => {
    const locationFilter: LocationFilter = position
      ? { locationType: LocationType.AROUND_ME, aroundRadius: 100 }
      : { locationType: LocationType.EVERYWHERE }

    // this reset staged in case of new search
    dispatchStagedSearch({ type: 'SET_STATE_FROM_NAVIGATE', payload: { locationFilter } })

    // this reset current search results
    navigate(...getTabNavConfig('Search', { locationFilter }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!position])

  const numberOfResults = plural(nbHits, {
    one: '# résultat',
    other: '# résultats',
  })

  const resultsWithSuffix = `${numberOfResults} pour `

  if (!nbHits) return <React.Fragment></React.Fragment>

  return (
    <Container accessibilityRole={AccessibilityRole.STATUS}>
      {venueLabel ? (
        <View {...getHeadingAttrs(2)}>
          <Body>{resultsWithSuffix}</Body>
          <Spacer.Column numberOfSpaces={4} />
          <ClippedTag label={venueLabel} onPress={removeVenueId} testId="Enlever le lieu" />
          <Spacer.Column numberOfSpaces={2} />
        </View>
      ) : (
        <Body {...getHeadingAttrs(2)}>{numberOfResults}</Body>
      )}
    </Container>
  )
}

const Container = styled.View({
  marginHorizontal: getSpacing(6),
  marginTop: getSpacing(2),
  marginBottom: getSpacing(4),
})

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
