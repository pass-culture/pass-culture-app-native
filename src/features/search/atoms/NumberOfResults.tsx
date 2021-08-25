import { plural } from '@lingui/macro'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { useSearch } from 'features/search/pages/SearchWrapper'
import { useVenueName } from 'features/venue/api/useVenue'
import { ClippedTag } from 'ui/components/ClippedTag'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
interface Props {
  nbHits: number
  venueId: number | null
}

export const NumberOfResults: React.FC<Props> = ({ nbHits, venueId }) => {
  const venueName = useVenueName(venueId)
  const { dispatch } = useSearch()

  const removeVenueId = useCallback(() => {
    dispatch({ type: 'SET_VENUE_ID', payload: null })
  }, [])

  const numberOfResults = plural(nbHits, {
    one: '# résultat',
    other: '# résultats',
  })

  const resultsWithSuffix = `${numberOfResults} pour `

  if (!nbHits) return <React.Fragment></React.Fragment>

  return (
    <Container>
      {venueName ? (
        <React.Fragment>
          <Body>{resultsWithSuffix}</Body>
          <Spacer.Column numberOfSpaces={4} />
          <ClippedTag label={venueName} onPress={removeVenueId} testId="Enlever le lieu" />
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
