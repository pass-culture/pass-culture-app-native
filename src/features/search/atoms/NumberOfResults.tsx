import { plural } from '@lingui/macro'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { useSearch } from 'features/search/pages/SearchWrapper'
import { useVenueName } from 'features/venue/api/useVenue'
import { testID } from 'tests/utils'
import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface Props {
  nbHits: number
  venueId: number | null
}

export const NumberOfResults: React.FC<Props> = ({ nbHits, venueId }) => {
  const venueName = useVenueName(venueId)
  const { dispatch } = useSearch()

  const numberOfResults = plural(nbHits, {
    one: '# résultat',
    other: '# résultats',
  })
  const resultsWithSuffix = `${numberOfResults} pour `

  const removeVenueId = useCallback(() => {
    dispatch({ type: 'SET_VENUE_ID', payload: null })
  }, [])

  if (!nbHits) return <React.Fragment></React.Fragment>

  return (
    <Container>
      {venueName ? (
        <React.Fragment>
          <Body>{resultsWithSuffix}</Body>
          <BoldBody>{venueName}</BoldBody>
          <TouchableOpacity onPress={removeVenueId}>
            <Close size={20} {...testID('Enlever le lieu')} />
          </TouchableOpacity>
        </React.Fragment>
      ) : (
        <Body>{numberOfResults}</Body>
      )}
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  margin: getSpacing(6),
  marginBottom: getSpacing(4),
})
const Body = styled(Typo.Body)({ color: ColorsEnum.GREY_DARK })
const BoldBody = styled(Typo.ButtonText)({ color: ColorsEnum.GREY_DARK })
const TouchableOpacity = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({
  paddingHorizontal: getSpacing(1),
})
