import { plural } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useVenueName } from 'features/venue/api/useVenue'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface Props {
  nbHits: number
  venueId: number | null
}

export const NumberOfResults: React.FC<Props> = ({ nbHits, venueId }) => {
  const venueName = useVenueName(venueId)
  if (!nbHits) return <React.Fragment></React.Fragment>

  const numberOfResults = plural(nbHits, {
    one: '# résultat',
    other: '# résultats',
  })
  const resultsWithSuffix = `${numberOfResults} pour `

  return (
    <Container>
      {venueName ? (
        <React.Fragment>
          <Body>{resultsWithSuffix}</Body>
          <BoldBody>{venueName}</BoldBody>
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
