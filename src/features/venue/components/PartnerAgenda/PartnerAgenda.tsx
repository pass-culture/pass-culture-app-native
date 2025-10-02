import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { VenueOffers as VenueOffersType } from 'features/venue/types'
import { Offer } from 'shared/offer/types'
import { Typo } from 'ui/theme'

type Props = {
  title: string
  venueOffers: VenueOffersType
}

export const PartnerAgenda: FunctionComponent<Props> = ({ title, venueOffers }: Props) => (
  <React.Fragment>
    <Typo.Title3>{title}</Typo.Title3>
    <StyledList>
      {venueOffers.hits.map((hit: Offer) => (
        <StyledListItem key={hit.objectID}>
          <Typo.Body>{hit.offer.name}</Typo.Body>
          <Typo.Body>{' - id: '}</Typo.Body>
          <Typo.Body>{hit.objectID}</Typo.Body>
          <Typo.Body>{' - Dates: '}</Typo.Body>
          <Typo.Body>
            {new Date((hit.offer.dates?.at(0) ?? 0) * 1000).toLocaleDateString()}
          </Typo.Body>
          <Typo.Body>{' - Prix: '}</Typo.Body>
          <StyledPrices>
            {hit.offer.prices?.map((price) => (
              <Typo.Body key={hit.objectID + price}>{price + ' '}</Typo.Body>
            ))}
          </StyledPrices>
        </StyledListItem>
      ))}
    </StyledList>
  </React.Fragment>
)

const StyledList = styled(View)({
  marginLeft: 10,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
})

const StyledListItem = styled(View)({
  height: '20px',
  display: 'flex',
  flexDirection: 'row',
})

const StyledPrices = styled(View)({
  display: 'flex',
  flexDirection: 'row',
})
