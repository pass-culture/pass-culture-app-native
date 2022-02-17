import { plural } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { LocationType } from 'features/search/enums'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { LocationFilter } from 'features/search/types'
import { useGeolocation } from 'libs/geolocation'
import { ClippedTag } from 'ui/components/ClippedTag'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
  }, [!position])

  const numberOfResults = plural(nbHits, {
    one: '# résultat',
    other: '# résultats',
  })

  const resultsWithSuffix = `${numberOfResults} pour `

  if (!nbHits) return <React.Fragment></React.Fragment>

  return (
    <Container>
      {venueLabel ? (
        <React.Fragment>
          <Body>{resultsWithSuffix}</Body>
          <Spacer.Column numberOfSpaces={4} />
          <ClippedTag label={venueLabel} onPress={removeVenueId} testId="Enlever le lieu" />
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      ) : (
        <Body aria-live="assertive">{numberOfResults}</Body>
      )}
    </Container>
  )
}

const Container = styled.View({
  margin: getSpacing(6),
  marginBottom: getSpacing(4),
})

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
