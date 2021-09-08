import { plural } from '@lingui/macro'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { LocationType } from 'features/search/enums'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useGeolocation } from 'libs/geolocation'
import { ClippedTag } from 'ui/components/ClippedTag'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  nbHits: number
}

export const NumberOfResults: React.FC<Props> = ({ nbHits }) => {
  const { searchState, dispatch } = useSearch()
  const { dispatch: stagedDispatch } = useStagedSearch()
  const { position } = useGeolocation()

  const venueLabel =
    searchState.locationFilter.locationType === LocationType.VENUE
      ? searchState.locationFilter.venue.label
      : null

  const removeVenueId = useCallback(() => {
    const actionType = position ? 'SET_LOCATION_AROUND_ME' : 'SET_LOCATION_EVERYWHERE'
    dispatch({ type: actionType })
    stagedDispatch({ type: actionType })
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
        <Body>{numberOfResults}</Body>
      )}
    </Container>
  )
}

const Container = styled.View({
  margin: getSpacing(6),
  marginBottom: getSpacing(4),
})

const Body = styled(Typo.Body)({ color: ColorsEnum.GREY_DARK })
